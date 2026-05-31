const http = require("http");
const https = require("https");
const net = require("net");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 4194);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || ROOT;
fs.mkdirSync(DATA_DIR, { recursive: true });
const ERROR_LOG = path.join(DATA_DIR, "server.err.log");
const STATE_FILE = path.join(DATA_DIR, "inventory_state.json");
const SEED_STATE_FILE = path.join(ROOT, "inventory_state.json");
const PFX_FILE = path.join(ROOT, "certs", "inventory-local.pfx");
const PFX_PASSWORD = process.env.INVENTORY_HTTPS_PASSWORD || "inventory-local-dev";
const USE_LOCAL_HTTPS = process.env.USE_LOCAL_HTTPS === "1";
const APP_VERSION = "20260601-monthly-master";

process.on("uncaughtException", (error) => {
  fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} ${error.stack || error}\n`);
});

process.on("unhandledRejection", (error) => {
  fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} ${error.stack || error}\n`);
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".cer": "application/pkix-cert"
};

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "interest-cohort=()"
};

const storeSettings = [
  { id: "asaka", name: "朝霞東口店", isAdmin: true },
  { id: "kumagaya", name: "熊谷南口店", isAdmin: false },
  { id: "urawa", name: "浦和道場店", isAdmin: false }
];

const loginUsers = {
  asaka: { password: "1122", storeId: "asaka", isAdmin: true },
  kumagaya: { password: "1122", storeId: "kumagaya", isAdmin: false },
  urawa: { password: "1122", storeId: "urawa", isAdmin: false }
};

function isPublicAsset(request) {
  const pathname = request.url.split("?")[0];
  return ["/app.css", "/app.js", "/sw.js", "/staff_qr.png", "/staff-qr.png", "/robots.txt"].includes(pathname);
}

function getRequestUser(request) {
  const header = request.headers.authorization || "";
  const match = header.match(/^Basic\s+(.+)$/i);
  if (!match) return null;

  const [id, password] = Buffer.from(match[1], "base64").toString("utf8").split(":");
  const user = loginUsers[id];
  if (!user || user.password !== password) return null;
  const store = storeSettings.find((item) => item.id === user.storeId);
  return { id, storeId: user.storeId, storeName: store?.name || user.storeId, isAdmin: user.isAdmin };
}

function isAuthorized(request) {
  return isPublicAsset(request) || Boolean(getRequestUser(request));
}

function createStoreData() {
  return {
    products: null,
    productsUpdatedAt: null,
    counts: {},
    countUpdatedAt: {},
    tabletop: {},
    tabletopUpdatedAt: {},
    inventoryArchives: [],
    productMasterArchives: [],
    savedAt: null
  };
}

function createInitialServerState() {
  return {
    products: [],
    productsUpdatedAt: null,
    stores: Object.fromEntries(storeSettings.map((store) => [store.id, createStoreData()]))
  };
}

function normalizeStoreData(value = {}) {
  return {
    products: Array.isArray(value.products) ? value.products : null,
    productsUpdatedAt: value.productsUpdatedAt ?? null,
    counts: value.counts && typeof value.counts === "object" ? value.counts : {},
    countUpdatedAt: value.countUpdatedAt && typeof value.countUpdatedAt === "object" ? value.countUpdatedAt : {},
    tabletop: value.tabletop && typeof value.tabletop === "object" ? value.tabletop : {},
    tabletopUpdatedAt: value.tabletopUpdatedAt && typeof value.tabletopUpdatedAt === "object" ? value.tabletopUpdatedAt : {},
    inventoryArchives: Array.isArray(value.inventoryArchives) ? value.inventoryArchives : [],
    productMasterArchives: Array.isArray(value.productMasterArchives) ? value.productMasterArchives : [],
    savedAt: value.savedAt ?? null
  };
}

function normalizeServerState(value = {}) {
  const next = createInitialServerState();
  next.products = Array.isArray(value.products) ? value.products : [];
  next.productsUpdatedAt = value.productsUpdatedAt ?? null;

  storeSettings.forEach((store) => {
    next.stores[store.id] = normalizeStoreData(value.stores?.[store.id]);
  });

  if (!value.stores && (value.counts || value.tabletop || value.savedAt)) {
    next.stores.asaka = normalizeStoreData(value);
  }

  return next;
}

function readState() {
  if (!fs.existsSync(STATE_FILE) && STATE_FILE !== SEED_STATE_FILE && fs.existsSync(SEED_STATE_FILE)) {
    fs.copyFileSync(SEED_STATE_FILE, STATE_FILE);
  }
  try {
    return normalizeServerState(JSON.parse(fs.readFileSync(STATE_FILE, "utf8")));
  } catch {
    return createInitialServerState();
  }
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`);
}

function timestamp(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function getStoreProducts(serverState, storeId) {
  const storeProducts = serverState.stores?.[storeId]?.products;
  return Array.isArray(storeProducts) ? storeProducts : serverState.products;
}

function getStoreProductsUpdatedAt(serverState, storeId) {
  return serverState.stores?.[storeId]?.productsUpdatedAt || serverState.productsUpdatedAt;
}

function buildProductMasterArchive(store, products, reason) {
  const archivedAt = new Date().toISOString();
  return {
    id: `master-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    storeId: store.id,
    storeName: store.name,
    archivedAt,
    reason,
    productCount: products.length,
    products: products.map((product) => ({ ...product }))
  };
}

function archiveStoreProducts(storeData, store, products, reason) {
  if (!Array.isArray(products) || !products.length) return;
  storeData.productMasterArchives = [
    buildProductMasterArchive(store, products, reason),
    ...storeData.productMasterArchives
  ].slice(0, 20);
}

function summarizeStore(storeData, products) {
  const rows = products.map((product) => {
    const quantity = Number(storeData.counts?.[product.id]);
    return {
      quantity: Number.isFinite(quantity) ? quantity : null,
      amount: Number.isFinite(quantity) ? quantity * Number(product.price || 0) : 0
    };
  });
  const counted = rows.filter((row) => row.quantity !== null).length;
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const updatedValues = [storeData.savedAt, ...Object.values(storeData.countUpdatedAt || {})].filter(Boolean);
  const latest = updatedValues.map(timestamp).filter(Boolean).sort((a, b) => b - a)[0];

  return {
    rate: products.length ? Math.round((counted / products.length) * 100) : 0,
    total,
    missing: products.length - counted,
    updatedAt: latest ? new Date(latest).toISOString() : null
  };
}

function buildInventoryArchive(storeData, products, user) {
  const closedAt = new Date().toISOString();
  const rows = products.map((product) => {
    const rawQuantity = storeData.counts?.[product.id];
    const quantity = rawQuantity === "" || rawQuantity === null || rawQuantity === undefined ? null : Number(rawQuantity);
    const hasQuantity = Number.isFinite(quantity);
    const price = Number(product.price || 0);
    return {
      productId: product.id,
      name: product.name,
      category: product.category || "",
      unit: product.unit || "",
      quantity: hasQuantity ? quantity : null,
      price,
      amount: hasQuantity ? quantity * price : 0,
      updatedAt: storeData.countUpdatedAt?.[product.id] || ""
    };
  });
  const counted = rows.filter((row) => row.quantity !== null).length;
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return {
    id: `archive-${Date.now()}`,
    storeId: user.storeId,
    storeName: user.storeName,
    closedAt,
    month: closedAt.slice(0, 7),
    total,
    counted,
    missing: rows.length - counted,
    productCount: rows.length,
    rows
  };
}

function buildClientState(serverState, user) {
  const storeData = normalizeStoreData(serverState.stores[user.storeId]);
  const progressEntries = user.isAdmin
    ? storeSettings.map((store) => [
        store.id,
        summarizeStore(normalizeStoreData(serverState.stores[store.id]), getStoreProducts(serverState, store.id))
      ])
    : [[user.storeId, summarizeStore(storeData, getStoreProducts(serverState, user.storeId))]];

  return {
    products: getStoreProducts(serverState, user.storeId),
    productsUpdatedAt: getStoreProductsUpdatedAt(serverState, user.storeId),
    ...storeData,
    products: getStoreProducts(serverState, user.storeId),
    productsUpdatedAt: getStoreProductsUpdatedAt(serverState, user.storeId),
    currentStoreId: user.storeId,
    currentStoreName: user.storeName,
    isAdmin: user.isAdmin,
    inventoryArchives: storeData.inventoryArchives,
    productMasterArchives: storeData.productMasterArchives?.map((archive) => ({
      id: archive.id,
      storeId: archive.storeId,
      storeName: archive.storeName,
      archivedAt: archive.archivedAt,
      reason: archive.reason,
      productCount: archive.productCount
    })) || [],
    storeProgress: Object.fromEntries(progressEntries)
  };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function buildInventoryCsv(serverState, user, scope) {
  if (scope === "all" && !user.isAdmin) {
    return null;
  }

  const targetStores = scope === "all" && user.isAdmin
    ? storeSettings
    : storeSettings.filter((store) => store.id === user.storeId);
  const headers = ["店舗ID", "店舗名", "商品ID", "商品名", "分類", "単位", "数量", "単価", "棚卸額", "入力状況", "最終更新日時"];
  const rows = [headers];

  targetStores.forEach((store) => {
    const storeData = normalizeStoreData(serverState.stores[store.id]);
    getStoreProducts(serverState, store.id).forEach((product) => {
      const rawQuantity = storeData.counts?.[product.id];
      const quantity = rawQuantity === "" || rawQuantity === null || rawQuantity === undefined ? null : Number(rawQuantity);
      const hasQuantity = Number.isFinite(quantity);
      const price = Number(product.price || 0);
      rows.push([
        store.id,
        store.name,
        product.id,
        product.name,
        product.category || "",
        product.unit || "",
        hasQuantity ? quantity : "",
        price,
        hasQuantity ? quantity * price : "",
        hasQuantity ? "入力済み" : "未入力",
        storeData.countUpdatedAt?.[product.id] || storeData.savedAt || ""
      ]);
    });
  });

  return `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\r\n")}\r\n`;
}

function parseAmount(value) {
  const amount = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(amount) ? amount : 0;
}

function getTabletopProducts(products) {
  return products.filter((product) => product.category === "卓上" && product.name !== "フライオイル");
}

function getFryOilProduct(products) {
  return products.find((product) => product.name === "フライオイル")
    ?? { id: "tabletop-fry-oil", name: "フライオイル", category: "フライオイル" };
}

function getTabletopEntry(storeData, itemId) {
  return storeData.tabletop?.[itemId] ?? { last: "", purchase: "", current: "" };
}

function getTabletopUpdatedAt(storeData, itemId) {
  const values = ["last", "purchase", "current"]
    .map((field) => storeData.tabletopUpdatedAt?.[`${itemId}.${field}`])
    .filter(Boolean);
  const latest = values.map(timestamp).filter(Boolean).sort((a, b) => b - a)[0];
  return latest ? new Date(latest).toISOString() : "";
}

function appendTabletopCsvRow(rows, store, storeData, product, section) {
  const entry = getTabletopEntry(storeData, product.id);
  const last = parseAmount(entry.last);
  const purchase = parseAmount(entry.purchase);
  const current = parseAmount(entry.current);
  rows.push([
    store.id,
    store.name,
    section,
    product.id,
    product.name,
    product.category || "",
    last,
    purchase,
    current,
    last + purchase - current,
    getTabletopUpdatedAt(storeData, product.id)
  ]);
}

function buildTabletopCsv(serverState, user, scope) {
  if (scope === "all" && !user.isAdmin) {
    return null;
  }

  const targetStores = scope === "all" && user.isAdmin
    ? storeSettings
    : storeSettings.filter((store) => store.id === user.storeId);
  const headers = ["店舗ID", "店舗名", "区分", "商品ID", "商品名", "分類", "先月棚卸高", "仕入れ額", "今月棚卸高", "原価", "最終更新日時"];
  const rows = [headers];

  targetStores.forEach((store) => {
    const storeData = normalizeStoreData(serverState.stores[store.id]);
    const products = getStoreProducts(serverState, store.id);
    let tabletopTotal = 0;

    getTabletopProducts(products).forEach((product) => {
      const entry = getTabletopEntry(storeData, product.id);
      tabletopTotal += parseAmount(entry.last) + parseAmount(entry.purchase) - parseAmount(entry.current);
      appendTabletopCsvRow(rows, store, storeData, product, "卓上");
    });

    rows.push([store.id, store.name, "卓上合計", "", "卓上原価合計", "", "", "", "", tabletopTotal, storeData.savedAt || ""]);
    appendTabletopCsvRow(rows, store, storeData, getFryOilProduct(products), "フライオイル");
  });

  return `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\r\n")}\r\n`;
}

function buildMonthlyArchiveCsv(serverState, user, scope) {
  if (scope === "all" && !user.isAdmin) {
    return null;
  }

  const targetStores = scope === "all" && user.isAdmin
    ? storeSettings
    : storeSettings.filter((store) => store.id === user.storeId);
  const headers = ["店舗ID", "店舗名", "対象月", "締め日時", "棚卸額", "入力済み件数", "未入力件数", "商品数"];
  const rows = [headers];

  targetStores.forEach((store) => {
    const storeData = normalizeStoreData(serverState.stores[store.id]);
    storeData.inventoryArchives
      .slice()
      .sort((left, right) => timestamp(right.closedAt) - timestamp(left.closedAt))
      .slice(0, 12)
      .forEach((archive) => {
        rows.push([
          store.id,
          store.name,
          archive.month || "",
          archive.closedAt || "",
          archive.total || 0,
          archive.counted || 0,
          archive.missing || 0,
          archive.productCount || 0
        ]);
      });
  });

  return `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\r\n")}\r\n`;
}

function mergeState(current, incoming, user) {
  const next = normalizeServerState(current);
  const store = normalizeStoreData(next.stores[user.storeId]);

  if (incoming.currentStoreId && incoming.currentStoreId !== user.storeId) {
    return next;
  }

  if (timestamp(incoming.productsUpdatedAt) > timestamp(store.productsUpdatedAt) && Array.isArray(incoming.products)) {
    archiveStoreProducts(store, { id: user.storeId, name: user.storeName }, getStoreProducts(next, user.storeId), "before-store-master-update");
    store.products = incoming.products;
    store.productsUpdatedAt = incoming.productsUpdatedAt;
  } else if (!next.products.length && Array.isArray(incoming.products)) {
    next.products = incoming.products;
    next.productsUpdatedAt = incoming.productsUpdatedAt || incoming.savedAt || new Date().toISOString();
  }

  Object.entries(incoming.countUpdatedAt || {}).forEach(([productId, updatedAt]) => {
    if (timestamp(updatedAt) <= timestamp(store.countUpdatedAt[productId])) return;
    if (Object.prototype.hasOwnProperty.call(incoming.counts || {}, productId)) {
      store.counts[productId] = incoming.counts[productId];
    } else {
      delete store.counts[productId];
    }
    store.countUpdatedAt[productId] = updatedAt;
  });

  Object.entries(incoming.tabletop || {}).forEach(([itemId, entry]) => {
    const mergedEntry = { ...(store.tabletop[itemId] || {}) };
    ["last", "purchase", "current"].forEach((field) => {
      const key = `${itemId}.${field}`;
      const updatedAt = incoming.tabletopUpdatedAt?.[key];
      if (timestamp(updatedAt) <= timestamp(store.tabletopUpdatedAt[key])) return;
      mergedEntry[field] = entry?.[field] ?? "";
      store.tabletopUpdatedAt[key] = updatedAt;
    });
    store.tabletop[itemId] = mergedEntry;
  });

  if (timestamp(incoming.savedAt) > timestamp(store.savedAt)) {
    store.savedAt = incoming.savedAt;
  }

  if (Array.isArray(incoming.inventoryArchives)) {
    const archiveMap = new Map(store.inventoryArchives.map((archive) => [archive.id || archive.closedAt, archive]));
    incoming.inventoryArchives.forEach((archive) => {
      if (!archive || typeof archive !== "object") return;
      archiveMap.set(archive.id || archive.closedAt || `archive-${archiveMap.size}`, archive);
    });
    store.inventoryArchives = [...archiveMap.values()]
      .sort((left, right) => timestamp(right.closedAt) - timestamp(left.closedAt))
      .slice(0, 36);
  }

  next.stores[user.storeId] = store;
  return next;
}

function closeMonthlyInventory(current, user) {
  const next = normalizeServerState(current);
  const store = normalizeStoreData(next.stores[user.storeId]);
  const archive = buildInventoryArchive(store, getStoreProducts(next, user.storeId), user);
  store.inventoryArchives = [archive, ...store.inventoryArchives].slice(0, 36);
  store.counts = {};
  store.countUpdatedAt = {};
  store.savedAt = archive.closedAt;
  next.stores[user.storeId] = store;
  return next;
}

function publishAsakaMaster(current, user) {
  if (!user.isAdmin || user.storeId !== "asaka") {
    return null;
  }

  const next = normalizeServerState(current);
  const sourceProducts = getStoreProducts(next, "asaka").map((product) => ({ ...product }));
  const updatedAt = new Date().toISOString();

  storeSettings.forEach((store) => {
    const storeData = normalizeStoreData(next.stores[store.id]);
    archiveStoreProducts(storeData, store, getStoreProducts(next, store.id), "before-asaka-master-publish");
    storeData.products = sourceProducts.map((product) => ({ ...product }));
    storeData.productsUpdatedAt = updatedAt;
    next.stores[store.id] = storeData;
  });

  next.products = sourceProducts.map((product) => ({ ...product }));
  next.productsUpdatedAt = updatedAt;
  return next;
}

function deleteMonthlyArchive(current, user, archiveId) {
  const next = normalizeServerState(current);
  const store = normalizeStoreData(next.stores[user.storeId]);
  store.inventoryArchives = store.inventoryArchives.filter((archive) => archive.id !== archiveId);
  next.stores[user.storeId] = store;
  return next;
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleApi(request, response, user) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  const apiPath = url.pathname;

  if (apiPath === "/api/monthly-close") {
    if (request.method !== "POST") {
      response.writeHead(405, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const closed = closeMonthlyInventory(readState(), user);
    writeState(closed);
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ state: buildClientState(closed, user) }));
    return;
  }

  if (apiPath === "/api/master/publish") {
    if (request.method !== "POST") {
      response.writeHead(405, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const published = publishAsakaMaster(readState(), user);
    if (!published) {
      response.writeHead(403, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Forbidden" }));
      return;
    }

    writeState(published);
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ state: buildClientState(published, user) }));
    return;
  }

  if (apiPath === "/api/monthly-archive/delete") {
    if (request.method !== "POST") {
      response.writeHead(405, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const body = await readRequestBody(request);
    const payload = JSON.parse(body || "{}");
    const deleted = deleteMonthlyArchive(readState(), user, String(payload.id || ""));
    writeState(deleted);
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ state: buildClientState(deleted, user) }));
    return;
  }

  if (apiPath === "/api/export.csv") {
    if (request.method !== "GET") {
      response.writeHead(405, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const scope = url.searchParams.get("scope") === "all" ? "all" : "store";
    const requestedType = url.searchParams.get("type");
    const type = ["tabletop", "monthly"].includes(requestedType) ? requestedType : "summary";
    const currentState = readState();
    const csv = type === "tabletop"
      ? buildTabletopCsv(currentState, user, scope)
      : type === "monthly"
        ? buildMonthlyArchiveCsv(currentState, user, scope)
        : buildInventoryCsv(currentState, user, scope);
    if (!csv) {
      response.writeHead(403, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Forbidden" }));
      return;
    }

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inventory-${type}-${scope}-${date}.csv"`,
      "Cache-Control": "no-store"
    });
    response.end(csv);
    return;
  }

  if (apiPath !== "/api/state") {
    response.writeHead(404, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (request.method === "GET") {
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ state: buildClientState(readState(), user) }));
    return;
  }

  if (request.method === "PUT") {
    const body = await readRequestBody(request);
    const payload = JSON.parse(body || "{}");
    const merged = mergeState(readState(), payload.state || {}, user);
    writeState(merged);
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify({ state: buildClientState(merged, user) }));
    return;
  }

  response.writeHead(405, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "Method not allowed" }));
}

function requestLogin(response) {
  response.writeHead(401, {
    ...noIndexHeaders,
    "WWW-Authenticate": 'Basic realm="Inventory Preview", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8"
  });
  response.end("パスワードを入力してください");
}

function getPublicOrigin(request) {
  const proto = request.headers["x-forwarded-proto"] || (USE_LOCAL_HTTPS ? "https" : "http");
  return `${proto}://${request.headers.host}`;
}

async function serveStaffQr(request, response) {
  const staffUrl = `${getPublicOrigin(request)}/staff.html?v=${APP_VERSION}`;

  try {
    const QRCode = require("qrcode");
    const png = await QRCode.toBuffer(staffUrl, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 244,
      color: {
        dark: "#000000",
        light: "#ffffff"
      },
      type: "png"
    });
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "image/png",
      "Cache-Control": "no-store"
    });
    response.end(png);
    return;
  } catch {
    const fallbackPath = path.join(ROOT, "staff_qr.png");
    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": "image/png",
      "Cache-Control": "no-store"
    });
    response.end(fs.readFileSync(fallbackPath));
  }
}

function serveFile(request, response) {
  const url = new URL(request.url, `https://${request.headers.host}`);
  if (url.pathname === "/s") {
    response.writeHead(302, {
      ...noIndexHeaders,
      "Location": `/staff.html?v=${APP_VERSION}`,
      "Cache-Control": "no-store"
    });
    response.end();
    return;
  }
  if (url.pathname === "/staff-qr.png") {
    serveStaffQr(request, response);
    return;
  }
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403, noIndexHeaders);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { ...noIndexHeaders, "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    if (requestedPath === "/app.js") {
      data = Buffer.from(patchClientScriptForStoreMasters(data.toString("utf8")), "utf8");
    }

    response.writeHead(200, {
      ...noIndexHeaders,
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
}

function patchClientScriptForStoreMasters(source) {
  return source
    .replaceAll("20260531-render-ready", APP_VERSION)
    .replace(
      'can: ["全店舗閲覧", "全店舗CSV出力", "商品マスター管理"],',
      'can: ["全店舗閲覧", "全店舗CSV出力", "自店舗商品マスター管理"],'
    )
    .replaceAll(
      'can: ["自店舗棚卸入力", "自店舗履歴閲覧", "自店舗CSV出力"],',
      'can: ["自店舗棚卸入力", "自店舗履歴閲覧", "自店舗CSV出力", "自店舗商品マスター管理"],'
    )
    .replaceAll(
      'cannot: ["他店舗閲覧", "全店舗閲覧", "全店舗CSV", "商品マスター管理"]',
      'cannot: ["他店舗閲覧", "全店舗閲覧", "全店舗CSV"]'
    )
    .replace(
      `function switchScreen(screen) {
  if (!state.isAdmin && screen === "master") {
    screen = "count";
  }
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.screen === screen));
  elements.screens.forEach((section) => section.classList.toggle("is-active", section.id === \`screen-\${screen}\`));
}`,
      `function switchScreen(screen) {
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.screen === screen));
  elements.screens.forEach((section) => section.classList.toggle("is-active", section.id === \`screen-\${screen}\`));
}`
    )
    .replace(
      `function applyStorePermissions() {
  elements.tabs.forEach((tab) => {
    if (tab.dataset.screen === "master") {
      tab.hidden = !state.isAdmin;
    }
  });
  if (elements.exportAllCsvButton) {
    elements.exportAllCsvButton.hidden = !state.isAdmin;
  }
  const activeMaster = document.querySelector("#screen-master")?.classList.contains("is-active");
  if (!state.isAdmin && activeMaster) switchScreen("count");
}`,
      `function applyStorePermissions() {
  if (elements.exportAllCsvButton) {
    elements.exportAllCsvButton.hidden = !state.isAdmin;
  }
}`
    );
}

async function handleRequest(request, response) {
  const user = getRequestUser(request);
  if (!isPublicAsset(request) && !user) {
    requestLogin(response);
    return;
  }

  try {
    if (request.url.startsWith("/api/")) {
      await handleApi(request, response, user);
      return;
    }
    serveFile(request, response);
  } catch (error) {
    fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} ${error.stack || error}\n`);
    response.writeHead(500, { ...noIndexHeaders, "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Server error" }));
  }
}

if (!USE_LOCAL_HTTPS) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, HOST, () => {
    console.log(`Inventory app: http://${HOST}:${PORT}/`);
    console.log("Users: asaka / kumagaya / urawa");
    console.log("Password: 1122");
  });
  server.on("error", (error) => {
    fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} ${error.stack || error}\n`);
  });
} else {
  const httpServer = http.createServer(handleRequest);
  const httpsServer = https.createServer({
    pfx: fs.readFileSync(PFX_FILE),
    passphrase: PFX_PASSWORD
  }, handleRequest);

  const mixedServer = net.createServer((socket) => {
    socket.once("data", (buffer) => {
      const server = buffer[0] === 22 ? httpsServer : httpServer;
      server.emit("connection", socket);
      socket.unshift(buffer);
      socket.resume();
    });
  })
  .listen(PORT, HOST, () => {
    console.log(`Inventory preview: https://${HOST}:${PORT}/`);
    console.log(`HTTP requests on ${PORT} redirect to HTTPS`);
    console.log("Users: asaka / kumagaya / urawa");
    console.log("Password: 1122");
  });

  mixedServer.on("error", (error) => {
    fs.appendFileSync(ERROR_LOG, `${new Date().toISOString()} ${error.stack || error}\n`);
  });
}
