const CACHE_NAME = "inventory-offline-v20260531-render-ready-1";
const OFFLINE_ASSETS = [
  "./",
  "./index.html",
  "./staff.html",
  "./manager.html",
  "./admin.html",
  "./app.css?v=20260531-render-ready",
  "./app.js?v=20260531-render-ready",
  "./staff-qr.png?v=20260531-render-ready"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => {
        if (cached) return cached;
        if (request.mode === "navigate" || request.destination === "document") {
          return caches.match("./staff.html");
        }
        return Response.error();
      }))
  );
});
