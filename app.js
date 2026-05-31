const STORAGE_KEY = "inventory-voice-count-v3-store-separated";
const LANGUAGE_KEY = "inventory-language-v1";
const CLIENT_ID_KEY = "inventory-client-id-v1";
const PENDING_SYNC_KEY = "inventory-pending-sync-v2-store-separated";
const SYNC_INTERVAL_MS = 15000;
const APP_VERSION = "20260601-monthly-master";
const languageNames = { ja: "日本語", my: "မြန်မာ", vi: "Tiếng Việt" };
const speechLanguages = { ja: "ja-JP", my: "my-MM", vi: "vi-VN" };
const stores = [
  {
    id: "asaka",
    name: "朝霞東口店",
    role: "管理者権限",
    can: ["全店舗閲覧", "全店舗CSV出力", "自店舗商品マスター管理"],
    cannot: []
  },
  {
    id: "kumagaya",
    name: "熊谷南口店",
    role: "自店舗のみ",
    can: ["自店舗棚卸入力", "自店舗履歴閲覧", "自店舗CSV出力", "自店舗商品マスター管理"],
    cannot: ["他店舗閲覧", "全店舗閲覧", "全店舗CSV"]
  },
  {
    id: "urawa",
    name: "浦和道場店",
    role: "自店舗のみ",
    can: ["自店舗棚卸入力", "自店舗履歴閲覧", "自店舗CSV出力", "自店舗商品マスター管理"],
    cannot: ["他店舗閲覧", "全店舗閲覧", "全店舗CSV"]
  }
];
const messages = {
  ja: {
    actions: "操作",
    appTitle: "棚卸カウント表",
    cancelEdit: "編集を解除",
    calculator: "電卓",
    category: "分類",
    categoryPlaceholder: "例: ドリンク",
    close: "閉じる",
    counted: "入力済み",
    countLead: "商品を選び、数量を音声または手入力で記録します。",
    countTitle: "棚卸入力",
    deleteProduct: "削除",
    deleteConfirm: "{name} を削除しますか？",
    displayLanguage: "表示言語",
    draftSavedAt: "下書き保存済み {date}",
    draftSave: "下書き保存",
    editProduct: "編集",
    emptyMissing: "未入力の商品はありません",
    addStock: "在庫を足す",
    addStockSaveNote: "加算もここで確定",
    inputOk: "入力OK",
    offlineReady: "オフラインでも入力できます。復旧後に同期します",
    offlinePending: "オフライン保存中。オンライン復旧後に反映します",
    onlineSynced: "オンライン同期済み {date}",
    syncFailed: "同期待ちです。通信復旧後に反映します",
    fryOilCost: "フライオイル原価",
    fryOilTitle: "フライオイル",
    inventoryAmount: "棚卸額",
    currentInventoryAmount: "今月棚卸高",
    languageChanged: "{language}表示に切り替えました",
    lastInventoryAmount: "先月棚卸高",
    masterDirty: "商品マスターに未保存の変更があります",
    masterLead: "商品名、分類、単位、単価を登録します。",
    masterTitle: "商品マスター",
    missing: "未入力",
    missingProducts: "未入力の商品",
    noProducts: "該当する商品がありません",
    incompleteSaveWarning: "未入力箇所があります。入力を終えて保存してください。",
    notSelected: "未選択",
    productDeleted: "商品を削除しました。確定して保存してください",
    productList: "商品一覧",
    productName: "商品名",
    productNamePlaceholder: "例: 生ビール樽",
    productSearch: "商品検索",
    productSearchPlaceholder: "例: ビール、米、肉",
    purchaseAmount: "仕入れ額",
    receiptClear: "写真をクリア",
    receiptFillForm: "登録欄へ入力する",
    receiptLead: "伝票を撮影し、画像を見ながら商品マスターへ登録します。",
    receiptManualPrice: "金額の記載がない場合は、単価欄へ手入力してください。",
    receiptNoPhoto: "撮影した伝票がここに表示されます",
    receiptPhoto: "伝票を撮影",
    receiptReadError: "読み取りできませんでした。画像を見ながら手入力してください。",
    receiptReadForm: "読み取りして登録候補を確認",
    receiptReadOk: "読み取り候補を表示しました",
    receiptReading: "読み取り中です",
    receiptRegisterLead: "登録したい商品だけ、商品名と単価を確認して登録してください。",
    receiptRegisterTitle: "読み取り結果を確認して登録",
    receiptRegisterItem: "この商品を登録",
    receiptSelectPhoto: "先に伝票を撮影してください",
    receiptTitle: "仕入れ伝票から追加",
    quantity: "数量",
    quantityByProduct: "商品ごとの数量",
    register: "登録",
    registeredOk: "登録されました",
    monthlyClose: "月次締め・入力リセット",
    monthlyCloseConfirm: "現在の棚卸額合計を履歴に保存し、入力数量をリセットします。集計CSVを出力してから月次締めします。",
    monthlyCloseCsvNotice: "月次締め前に集計CSVを出力します",
    monthlyCloseDone: "月次締めを保存し、入力数量をリセットしました",
    lastClosedInventory: "前回締め棚卸額",
    lastClosedDate: "前回締め日時",
    publishMaster: "朝霞マスターを全店舗へ配信",
    publishMasterConfirm: "朝霞東口店の商品マスターを熊谷南口店・浦和道場店へ配信します。各店舗の商品マスターは朝霞の内容で上書きされます。",
    publishMasterDone: "朝霞の商品マスターを全店舗へ配信しました",
    saveAll: "確定して保存",
    savedAt: "保存済み {date}",
    saveSelected: "この商品を確定",
    screenSwitch: "画面切替",
    staffQr: "棚卸入力QRコード",
    staffQrHelper: "入力補助者はQRコードからログイン",
    staffQrTitle: "スタッフ入力QR",
    selectProduct: "商品を選択してください",
    selectedProduct: "選択中の商品",
    speechNotSupported: "このブラウザは音声入力に対応していません",
    summaryLead: "入力済み数量と棚卸額、未入力商品を確認します。",
    summaryTitle: "集計",
    tabCount: "棚卸入力",
    tabMaster: "商品マスター",
    tabSummary: "集計",
    tabMonthly: "月次記録",
    monthlyHistoryTitle: "月次棚卸記録",
    monthlyHistoryLead: "月次締めで保存した棚卸額を12か月分確認します。",
    monthlyHistoryCsv: "月次記録CSV",
    monthlyNoHistory: "月次記録はまだありません",
    monthlyDelete: "削除",
    monthlyDeleteConfirm: "この月次記録を削除しますか？",
    monthlyDeleted: "月次記録を削除しました",
    tabTabletop: "卓上原価計算",
    tabletopCost: "卓上原価",
    tabletopLead: "卓上商品の先月棚卸高、仕入れ額、今月棚卸高から卓上原価を計算します。",
    tabletopTitle: "卓上原価計算",
    tabletopTotalCost: "卓上原価合計",
    totalInventoryAmount: "棚卸額合計",
    unit: "単位",
    unitPlaceholder: "例: 本、kg、袋",
    unitPrice: "単価",
    unsaved: "未保存の変更があります",
    noUnsaved: "未保存の変更はありません",
    pricePlaceholder: "例: 1200",
    unentered: "未入力",
    voiceInput: "音声入力",
    voiceFailed: "音声入力に失敗しました。手入力で修正できます",
    voiceReady: "音声入力ボタンを押して数量を話してください",
    voiceSelectProduct: "商品を選ぶと音声入力できます",
    voiceListening: "聞き取り中です",
    voiceParsed: "「{transcript}」を {quantity} として入力しました",
    voiceParseFailed: "聞き取り結果「{transcript}」から数量を判定できませんでした"
  },
  my: {
    actions: "လုပ်ဆောင်ချက်",
    appTitle: "စာရင်းစစ် ရေတွက်စာရင်း",
    cancelEdit: "ပြင်ဆင်မှု ရပ်မည်",
    category: "အမျိုးအစား",
    categoryPlaceholder: "ဥပမာ: အချိုရည်",
    close: "ပိတ်မည်",
    counted: "ဖြည့်ပြီး",
    countLead: "ပစ္စည်းကိုရွေးပြီး အရေအတွက်ကို အသံဖြင့် သို့မဟုတ် လက်ဖြင့် ထည့်ပါ။",
    countTitle: "စာရင်းစစ် ထည့်ရန်",
    deleteProduct: "ဖျက်မည်",
    deleteConfirm: "{name} ကို ဖျက်မလား။",
    displayLanguage: "ပြသဘာသာစကား",
    draftSavedAt: "မူကြမ်း သိမ်းပြီး {date}",
    draftSave: "မူကြမ်း သိမ်းမည်",
    editProduct: "ပြင်မည်",
    emptyMissing: "မဖြည့်ရသေးသော ပစ္စည်း မရှိပါ",
    addStock: "လက်ကျန် ထပ်ပေါင်း",
    addStockSaveNote: "ထပ်ပေါင်းလည်း ဤနေရာတွင် အတည်ပြု",
    inputOk: "入力OK",
    offlineReady: "အော့ဖ်လိုင်း에서도 ထည့်နိုင်သည်။ ပြန်ချိတ်လျှင် စင့်ခ်မည်",
    offlinePending: "အော့ဖ်လိုင်း သိမ်းထားသည်။ အွန်လိုင်းပြန်ဖြစ်လျှင် တင်မည်",
    onlineSynced: "အွန်လိုင်း စင့်ခ်ပြီး {date}",
    syncFailed: "စင့်ခ်ရန် စောင့်နေသည်။ ကွန်ရက်ပြန်ရလျှင် တင်မည်",
    fryOilCost: "ကြော်ဆီ ကုန်ကျစရိတ်",
    fryOilTitle: "ကြော်ဆီ",
    inventoryAmount: "စာရင်းစစ်တန်ဖိုး",
    currentInventoryAmount: "ယခုလ စာရင်းတန်ဖိုး",
    languageChanged: "{language} သို့ ပြောင်းထားသည်",
    lastInventoryAmount: "ပြီးခဲ့သည့်လ စာရင်းတန်ဖိုး",
    masterDirty: "ပစ္စည်းမာစတာတွင် မသိမ်းရသေးသော ပြောင်းလဲမှုရှိသည်",
    masterLead: "ပစ္စည်းအမည်၊ အမျိုးအစား၊ ယူနစ်၊ ဈေးနှုန်းကို မှတ်ပုံတင်ပါ။",
    masterTitle: "ပစ္စည်းမာစတာ",
    missing: "မဖြည့်ရသေး",
    missingProducts: "မဖြည့်ရသေးသော ပစ္စည်းများ",
    noProducts: "ကိုက်ညီသော ပစ္စည်း မရှိပါ",
    incompleteSaveWarning: "မဖြည့်ရသေးသော နေရာရှိပါသည်။ အားလုံးဖြည့်ပြီးမှ သိမ်းပါ။",
    notSelected: "မရွေးထားပါ",
    productDeleted: "ပစ္စည်းကို ဖျက်ပြီးပါပြီ။ သိမ်းရန် ခလုတ်နှိပ်ပါ",
    productList: "ပစ္စည်းစာရင်း",
    productName: "ပစ္စည်းအမည်",
    productNamePlaceholder: "ဥပမာ: ဘီယာကက်",
    productSearch: "ပစ္စည်းရှာရန်",
    productSearchPlaceholder: "ဥပမာ: ဘီယာ၊ ဆန်၊ အသား",
    purchaseAmount: "ဝယ်ယူငွေ",
    receiptClear: "ဓာတ်ပုံရှင်းမည်",
    receiptFillForm: "မှတ်ပုံတင်欄へ入力",
    receiptLead: "ဘောက်ချာကိုဓာတ်ပုံရိုက်ပြီး ပုံကိုကြည့်ながら ပစ္စည်းမာစတာへ登録します。",
    receiptManualPrice: "ငွေပမာဏမပါလျှင် တစ်ယူနစ်ဈေး欄へလက်入力してください。",
    receiptNoPhoto: "ရိုက်ထားသော ဘောက်ချာပုံがここに表示されます",
    receiptPhoto: "ဘောက်ချာ撮影",
    receiptReadError: "မဖတ်နိုင်ပါ။ ပုံを見ながら手入力してください。",
    receiptReadForm: "読み取りして登録候補を確認",
    receiptReadOk: "読み取り候補を表示しました",
    receiptReading: "読み取り中です",
    receiptRegisterLead: "登録したい商品だけ、商品名と単価を確認して登録してください。",
    receiptRegisterTitle: "読み取り結果を確認して登録",
    receiptRegisterItem: "ဤပစ္စည်းကို မှတ်ပုံတင်",
    receiptSelectPhoto: "先に伝票を撮影してください",
    receiptTitle: "仕入れ伝票から追加",
    quantity: "အရေအတွက်",
    quantityByProduct: "ပစ္စည်းအလိုက် အရေအတွက်",
    register: "မှတ်ပုံတင်",
    registeredOk: "မှတ်ပုံတင်ပြီးပါပြီ",
    monthlyClose: "လစဉ် ပိတ်ပြီး အရေအတွက် ပြန်လည်စမည်",
    monthlyCloseConfirm: "လက်ရှိစာရင်းတန်ဖိုးကို မှတ်တမ်းသိမ်းပြီး CSV ထုတ်ပြီးနောက် အရေအတွက်များကို ဖျက်မည်။",
    monthlyCloseCsvNotice: "လစဉ်ပိတ်မီ CSV ထုတ်မည်",
    monthlyCloseDone: "လစဉ်မှတ်တမ်းသိမ်းပြီး အရေအတွက်များကို ပြန်စထားသည်",
    lastClosedInventory: "နောက်ဆုံးပိတ် စာရင်းတန်ဖိုး",
    lastClosedDate: "နောက်ဆုံးပိတ်ချိန်",
    publishMaster: "Asaka မာစတာကို ဆိုင်အားလုံးသို့ပို့",
    publishMasterConfirm: "Asaka Higashiguchi ဆိုင်၏ ပစ္စည်းမာစတာဖြင့် Kumagaya နှင့် Urawa ကို အစားထိုးမည်။",
    publishMasterDone: "Asaka ပစ္စည်းမာစတာကို ဆိုင်အားလုံးသို့ ပို့ပြီးပါပြီ",
    saveAll: "အတည်ပြုပြီး သိမ်းမည်",
    savedAt: "သိမ်းပြီး {date}",
    saveSelected: "ဤပစ္စည်းကို အတည်ပြု",
    screenSwitch: "မျက်နှာပြင် ပြောင်းရန်",
    staffQr: "စာရင်းစစ်ထည့်ရန် QR ကုဒ်",
    staffQrHelper: "ကူညီထည့်သွင်းသူသည် QR ကုဒ်မှ ဝင်ပါ",
    staffQrTitle: "ဝန်ထမ်းထည့်ရန် QR",
    selectProduct: "ပစ္စည်းကို ရွေးပါ",
    selectedProduct: "ရွေးထားသော ပစ္စည်း",
    speechNotSupported: "ဤဘရောက်ဇာသည် အသံထည့်ခြင်းကို မထောက်ပံ့ပါ",
    summaryLead: "ဖြည့်ပြီး အရေအတွက်၊ စာရင်းစစ်တန်ဖိုးနှင့် မဖြည့်ရသေးသောပစ္စည်းများကို စစ်ပါ။",
    summaryTitle: "စုစုပေါင်း",
    tabCount: "စာရင်းစစ် ထည့်ရန်",
    tabMaster: "ပစ္စည်းမာစတာ",
    tabSummary: "စုစုပေါင်း",
    tabMonthly: "လစဉ်မှတ်တမ်း",
    monthlyHistoryTitle: "လစဉ်စာရင်းမှတ်တမ်း",
    monthlyHistoryLead: "လစဉ်ပိတ်ထားသော စာရင်းတန်ဖိုးကို 12 လစာ ကြည့်ပါ။",
    monthlyHistoryCsv: "လစဉ် CSV",
    monthlyNoHistory: "လစဉ်မှတ်တမ်း မရှိသေးပါ",
    monthlyDelete: "ဖျက်မည်",
    monthlyDeleteConfirm: "ဤလစဉ်မှတ်တမ်းကို ဖျက်မလား။",
    monthlyDeleted: "လစဉ်မှတ်တမ်း ဖျက်ပြီးပါပြီ",
    tabTabletop: "စားပွဲပေါ်ပစ္စည်း ကုန်ကျစရိတ်",
    tabletopCost: "ကုန်ကျစရိတ်",
    tabletopLead: "စားပွဲပေါ်ပစ္စည်းများ၏ ပြီးခဲ့သည့်လစာရင်း၊ ဝယ်ယူငွေ၊ ယခုလစာရင်းမှ ကုန်ကျစရိတ်တွက်ပါ။",
    tabletopTitle: "စားပွဲပေါ်ပစ္စည်း ကုန်ကျစရိတ်",
    tabletopTotalCost: "စုစုပေါင်း ကုန်ကျစရိတ်",
    totalInventoryAmount: "စုစုပေါင်း စာရင်းစစ်တန်ဖိုး",
    unit: "ယူနစ်",
    unitPlaceholder: "ဥပမာ: ပုလင်း၊ kg၊ အိတ်",
    unitPrice: "တစ်ယူနစ်ဈေး",
    unsaved: "မသိမ်းရသေးသော ပြောင်းလဲမှုရှိသည်",
    noUnsaved: "မသိမ်းရသေးသော ပြောင်းလဲမှု မရှိပါ",
    pricePlaceholder: "ဥပမာ: 1200",
    unentered: "မဖြည့်ရသေး",
    voiceInput: "အသံဖြင့်ထည့်ရန်",
    voiceFailed: "အသံထည့်ခြင်း မအောင်မြင်ပါ။ လက်ဖြင့် ပြင်နိုင်သည်",
    voiceReady: "အသံခလုတ်ကို နှိပ်ပြီး အရေအတွက်ကို ပြောပါ",
    voiceSelectProduct: "ပစ္စည်းကို ရွေးပြီးမှ အသံဖြင့် ထည့်နိုင်သည်",
    voiceListening: "နားထောင်နေသည်",
    voiceParsed: "「{transcript}」ကို {quantity} အဖြစ် ထည့်လိုက်သည်",
    voiceParseFailed: "「{transcript}」မှ အရေအတွက်ကို မဖတ်နိုင်ပါ"
  },
  vi: {
    actions: "Thao tác",
    appTitle: "Bảng kiểm kê",
    cancelEdit: "Hủy sửa",
    category: "Nhóm",
    categoryPlaceholder: "VD: Đồ uống",
    close: "Đóng",
    counted: "Đã nhập",
    countLead: "Chọn sản phẩm rồi nhập số lượng bằng giọng nói hoặc nhập tay.",
    countTitle: "Nhập kiểm kê",
    deleteProduct: "Xóa",
    deleteConfirm: "Xóa {name}?",
    displayLanguage: "Ngôn ngữ hiển thị",
    draftSavedAt: "Đã lưu nháp {date}",
    draftSave: "Lưu nháp",
    editProduct: "Sửa",
    emptyMissing: "Không còn sản phẩm chưa nhập",
    addStock: "Cộng thêm tồn",
    addStockSaveNote: "Cộng thêm cũng xác nhận ở đây",
    inputOk: "Đã nhập OK",
    offlineReady: "Có thể nhập khi mất mạng. Khi có mạng sẽ đồng bộ",
    offlinePending: "Đã lưu ngoại tuyến. Khi có mạng sẽ phản ánh",
    onlineSynced: "Đã đồng bộ online {date}",
    syncFailed: "Đang chờ đồng bộ. Khi có mạng sẽ phản ánh",
    fryOilCost: "Giá vốn dầu chiên",
    fryOilTitle: "Dầu chiên",
    inventoryAmount: "Giá trị tồn",
    currentInventoryAmount: "Tồn cuối tháng này",
    languageChanged: "Đã chuyển sang {language}",
    lastInventoryAmount: "Tồn cuối tháng trước",
    masterDirty: "Có thay đổi chưa lưu trong danh mục sản phẩm",
    masterLead: "Đăng ký tên sản phẩm, nhóm, đơn vị và đơn giá.",
    masterTitle: "Danh mục sản phẩm",
    missing: "Chưa nhập",
    missingProducts: "Sản phẩm chưa nhập",
    noProducts: "Không có sản phẩm phù hợp",
    incompleteSaveWarning: "Còn mục chưa nhập. Hãy nhập xong rồi lưu.",
    notSelected: "Chưa chọn",
    productDeleted: "Đã xóa sản phẩm. Hãy xác nhận để lưu",
    productList: "Danh sách sản phẩm",
    productName: "Tên sản phẩm",
    productNamePlaceholder: "VD: Thùng bia",
    productSearch: "Tìm sản phẩm",
    productSearchPlaceholder: "VD: bia, gạo, thịt",
    purchaseAmount: "Tiền nhập",
    receiptClear: "Xóa ảnh",
    receiptFillForm: "Nhập vào ô đăng ký",
    receiptLead: "Chụp phiếu nhập và đăng ký vào danh mục khi xem ảnh.",
    receiptManualPrice: "Nếu phiếu không có giá, hãy nhập tay vào ô đơn giá.",
    receiptNoPhoto: "Ảnh phiếu nhập sẽ hiển thị ở đây",
    receiptPhoto: "Chụp phiếu",
    receiptReadError: "Không đọc được. Hãy nhập tay khi xem ảnh.",
    receiptReadForm: "Đọc ảnh và xem ứng viên",
    receiptReadOk: "Đã hiển thị ứng viên đọc được",
    receiptReading: "Đang đọc ảnh",
    receiptRegisterLead: "Chỉ đăng ký sản phẩm cần thêm sau khi kiểm tra tên và đơn giá.",
    receiptRegisterTitle: "Kiểm tra kết quả đọc và đăng ký",
    receiptRegisterItem: "Đăng ký sản phẩm này",
    receiptSelectPhoto: "Hãy chụp phiếu trước",
    receiptTitle: "Thêm từ phiếu nhập",
    quantity: "Số lượng",
    quantityByProduct: "Số lượng theo sản phẩm",
    register: "Đăng ký",
    registeredOk: "Đã đăng ký",
    monthlyClose: "Chốt tháng và xóa số nhập",
    monthlyCloseConfirm: "Lưu tổng giá trị kiểm kê hiện tại, xuất CSV rồi xóa số lượng đã nhập.",
    monthlyCloseCsvNotice: "Sẽ xuất CSV trước khi chốt tháng",
    monthlyCloseDone: "Đã chốt tháng và xóa số lượng đã nhập",
    lastClosedInventory: "Giá trị chốt gần nhất",
    lastClosedDate: "Thời gian chốt gần nhất",
    publishMaster: "Phát danh mục Asaka cho toàn bộ cửa hàng",
    publishMasterConfirm: "Danh mục sản phẩm của Asaka Higashiguchi sẽ ghi đè sang Kumagaya và Urawa.",
    publishMasterDone: "Đã phát danh mục Asaka cho toàn bộ cửa hàng",
    saveAll: "Xác nhận và lưu",
    savedAt: "Đã lưu {date}",
    saveSelected: "Xác nhận sản phẩm này",
    screenSwitch: "Chuyển màn hình",
    staffQr: "Mã QR nhập kiểm kê",
    staffQrHelper: "Người hỗ trợ nhập đăng nhập bằng mã QR",
    staffQrTitle: "QR cho nhân viên",
    selectProduct: "Hãy chọn sản phẩm",
    selectedProduct: "Sản phẩm đang chọn",
    speechNotSupported: "Trình duyệt này không hỗ trợ nhập giọng nói",
    summaryLead: "Kiểm tra số lượng đã nhập, giá trị tồn và sản phẩm chưa nhập.",
    summaryTitle: "Tổng hợp",
    tabCount: "Nhập kiểm kê",
    tabMaster: "Danh mục",
    tabSummary: "Tổng hợp",
    tabMonthly: "Ghi chép tháng",
    monthlyHistoryTitle: "Ghi chép kiểm kê tháng",
    monthlyHistoryLead: "Xem giá trị kiểm kê đã chốt trong 12 tháng.",
    monthlyHistoryCsv: "CSV ghi chép tháng",
    monthlyNoHistory: "Chưa có ghi chép tháng",
    monthlyDelete: "Xóa",
    monthlyDeleteConfirm: "Xóa ghi chép tháng này?",
    monthlyDeleted: "Đã xóa ghi chép tháng",
    tabTabletop: "Giá vốn đồ bàn",
    tabletopCost: "Giá vốn đồ bàn",
    tabletopLead: "Tính giá vốn đồ bàn từ tồn tháng trước, tiền nhập và tồn tháng này.",
    tabletopTitle: "Tính giá vốn đồ bàn",
    tabletopTotalCost: "Tổng giá vốn đồ bàn",
    totalInventoryAmount: "Tổng giá trị tồn",
    unit: "Đơn vị",
    unitPlaceholder: "VD: chai, kg, túi",
    unitPrice: "Đơn giá",
    unsaved: "Có thay đổi chưa lưu",
    noUnsaved: "Không có thay đổi chưa lưu",
    pricePlaceholder: "VD: 1200",
    unentered: "Chưa nhập",
    voiceInput: "Nhập giọng nói",
    voiceFailed: "Nhập giọng nói thất bại. Có thể sửa bằng tay",
    voiceReady: "Nhấn nút giọng nói rồi nói số lượng",
    voiceSelectProduct: "Chọn sản phẩm để dùng nhập giọng nói",
    voiceListening: "Đang nghe",
    voiceParsed: "Đã nhập 「{transcript}」 là {quantity}",
    voiceParseFailed: "Không đọc được số lượng từ 「{transcript}」"
  }
};

const defaultProducts = [
  product("北の味噌", "食材 No.1", "kg", 840),
  product("リズム焙煎味噌ラーメンスープ", "食材 No.1", "kg", 1075),
  product("トンコツかえし", "食材 No.1", "本", 1480),
  product("リズム醤油かえし", "食材 No.1", "kg", 851),
  product("塩かえし", "食材 No.1", "kg", 1274),
  product("麺ストレート", "食材 No.1", "食", 66.15),
  product("麺ウェーブ細", "食材 No.1", "食", 66.58),
  product("麺ウェーブ太", "食材 No.1", "食", 66.58),
  product("無洗米(UCC/種商)", "食材 No.1", "kg/P", 583),
  product("米(地場仕入)", "食材 No.1", "kg", 0),
  product("万能調味料", "食材 No.1", "P", 1524),
  product("薄口醤油", "食材 No.1", "L", 253),
  product("リズム旨味タレ", "食材 No.1", "L", 628),
  product("ポークオイルAT", "食材 No.1", "kg", 499),
  product("コーン＆キャノーラ", "食材 No.1", "缶", 7217),
  product("落花生油", "食材 No.1", "kg", 1907),
  product("ガーリックオイル", "食材 No.1", "kg/P", 1136),
  product("特製ネギ油", "食材 No.1", "kg", 2778),
  product("ラー油", "食材 No.1", "本", 2810),
  product("ポリごま油", "食材 No.1", "本", 2539),
  product("旨味脂", "食材 No.1", "P", 3538),
  product("マー油", "食材 No.1", "kg", 1758),
  product("和ぶしオイル", "食材 No.1", "kg", 2521),
  product("唐揚げつけ込みのタレ", "食材 No.1", "P", 324),
  product("冷し中華ごまぴり辛", "食材 No.1", "kg/P", 1000),
  product("冷やし中華醤油ダレ", "食材 No.1", "本", 2405),
  product("冷し中華梅タレ", "食材 No.1", "本", 2160),
  product("油そばのたれ", "食材 No.1", "本", 2427),
  product("つけ麺タレ", "食材 No.1", "kg/P", 910),
  product("担々ラー油", "食材 No.1", "kg", 1560),
  product("まぶし粉", "食材 No.1", "kg/P", 197),
  product("バッター粉", "食材 No.1", "kg/P", 740),
  product("片栗粉", "食材 No.1", "kg/P", 359),
  product("味付メンマ", "食材 No.1", "kg/P", 751),
  product("リズム焼飯", "食材 No.1", "kg/P", 538),
  product("焼海苔", "食材 No.1", "枚", 6.3),
  product("つぼ漬け", "食材 No.1", "P", 381),
  product("カリカリガーリック", "食材 No.1", "kg/P", 4000),
  product("バター", "食材 No.1", "個", 40.3),
  product("とんこつスープ", "食材 No.1", "kg/P", 1088),
  product("PBガラーNS 1010", "食材 No.1", "g", 1.54),
  product("茹で餃子", "食材 No.1", "個", 25.82),
  product("焼き餃子", "食材 No.1", "個", 18.73),
  product("スーパースイートコーン", "食材 No.1", "kg/P", 500),
  product("鶏モモ肉", "食材 No.1", "kg", 708),
  product("風風パーコー", "食材 No.1", "枚", 130),
  product("チャーシュー", "食材 No.1", "kg", 1942),
  product("ソーセージ", "食材 No.1", "P", 252),
  product("まろやか鶏白湯", "食材 No.1", "kg", 1300),
  product("肉そぼろ", "食材 No.1", "kg/P", 1229),
  product("きぬさや", "食材 No.1", "P", 498),
  product("ポテト", "食材 No.1", "kg/P", 550),
  product("春巻き 10本", "食材 No.1", "個", 41),
  product("軟骨の唐揚げ", "食材 No.1", "kg", 879),
  product("クレープ苺ミルク", "食材 No.1", "本", 167),
  product("クレープチョコバナナ", "食材 No.1", "本", 167),
  product("クレープWチョコ", "食材 No.1", "本", 167),
  product("T/O容器ラーメン 本体", "テイク資材", "枚", 0),
  product("T/O容器ラーメン 中皿", "テイク資材", "枚", 0),
  product("T/O容器ラーメン 蓋", "テイク資材", "枚", 0),
  product("T/O容器 白", "テイク資材", "枚", 0),
  product("T/O容器 弁当本体＋蓋", "テイク資材", "枚", 0),
  product("トマト", "フェア食材", "個", 0),
  product("キューリ", "フェア食材", "個", 0),
  product("大葉", "フェア食材", "枚", 98),
  product("梅だれ 1.1kg", "フェア食材", "本", 1300),
  product("おにぎりの素 かりかり梅500g", "フェア食材", "g", 2.6),
  product("手羽先", "食材 No.2", "kg/P", 2132),
  product("手羽先のタレ", "食材 No.2", "本", 680),
  product("にんにく唐辛子", "食材 No.2", "kg", 6431),
  product("輪切り唐辛子", "食材 No.2", "p", 475),
  product("山椒", "食材 No.2", "p", 500),
  product("おろし生姜", "食材 No.2", "kg", 929),
  product("おろしにんにく", "食材 No.2", "kg", 1000),
  product("冷水ウーロン茶", "食材 No.2", "P", 19),
  product("ホワイトペッパー", "食材 No.2", "kg", 2150),
  product("秘伝・赤みそ", "食材 No.2", "kg", 1248),
  product("りんご酢", "食材 No.2", "L", 256),
  product("穀物酢", "食材 No.2", "L", 227),
  product("餃子のたれ", "食材 No.2", "L", 594),
  product("ブラックペッパー", "食材 No.2", "g", 3.7),
  product("紅生姜千切", "食材 No.2", "P", 686),
  product("風風からし高菜", "食材 No.2", "P", 635),
  product("中力粉(日清 雪)", "食材 No.2", "kg", 343),
  product("ケチャップ", "食材 No.2", "kg", 391),
  product("いりゴマ（白）", "食材 No.2", "kg/P", 600),
  product("塩", "食材 No.2", "kg", 100),
  product("上白砂糖", "食材 No.2", "kg/P", 312),
  product("マヨネーズ", "食材 No.2", "kg", 544),
  product("からし", "食材 No.2", "本", 100),
  product("黒胡麻", "食材 No.2", "g", 1),
  product("カット白髪ねぎ", "食材 No.2", "kg", 1316),
  product("青ねぎ", "食材 No.2", "kg", 954),
  product("白ねぎ 小口切", "食材 No.2", "kg", 1334),
  product("もやし", "食材 No.2", "1袋", 49),
  product("卵", "食材 No.2", "個", 23),
  product("サニーレタス", "食材 No.2", "株", 200),
  product("唐揚げ仕込", "食材 No.2", "kg", 893),
  product("味噌ダレ仕込み", "食材 No.2", "kg", 958),
  product("カキフライ", "食材 No.2", "個", 120),
  product("練り胡麻", "食材 No.2", "kg", 1110),
  product("酢豚ソース", "食材 No.2", "kg", 859),
  product("タルタルソース", "食材 No.2", "g", 0.96),
  product("チリパウダー", "食材 No.2", "g", 2),
  product("明太子(ばらこ)", "食材 No.2", "g", 2.7),
  product("豆板醤", "食材 No.2", "g", 1),
  product("豆乳鍋スープ", "食材 No.2", "g", 240),
  product("トマトガーリック", "食材 No.2", "g", 22.5),
  product("ゴマドレッシング", "食材 No.2", "g", 100),
  product("食研つゆ", "食材 No.2", "L", 730),
  product("ほぐし鶏", "食材 No.2", "g", 1.7),
  product("オイスターソース815", "食材 No.2", "g", 1.3),
  product("激辛四川ラー油", "食材 No.2", "g", 1.6),
  product("赤マー油", "食材 No.2", "g", 2.2),
  product("パワフル", "食材 No.2", "個", 4.8),
  product("ポッカレモン", "食材 No.2", "cc", 2),
  product("オレンジ", "ドリンク", "本", 70),
  product("コーラ", "ドリンク", "本", 83),
  product("ドライゼロ（30本）", "ドリンク", "本", 130),
  product("スーパードライ", "酒類", "L", 0),
  product("瓶ビール（20本）", "酒類", "本", 250),
  product("ガスボンベ", "備品", "kg", 0),
  product("とんこつ", "仕込品", "個", 20),
  product("しょうゆ", "仕込品", "個", 31),
  product("みそ", "仕込品", "個", 53),
  product("しお", "仕込品", "個", 33),
  product("担々", "仕込品", "個", 109),
  product("つけ麺", "仕込品", "個", 45),
  product("混合油", "仕込品", "本", 2325),
  product("油そばの油", "仕込品", "本", 1873),
  product("煮玉子", "仕込品", "個", 23),
  product("煮玉子タレ", "仕込品", "個", 157),
  product("南蛮タレ", "仕込品", "g", 1),
  product("T/O容器ラーメン本体", "テイク資材 No.4", "枚", 27),
  product("T/O容器ラーメン中皿", "テイク資材 No.4", "枚", 20),
  product("T/O容器ラーメン蓋", "テイク資材 No.4", "枚", 19),
  product("T/O袋 小", "テイク資材 No.4", "枚", 3),
  product("T/O袋 中(弁当)", "テイク資材 No.4", "枚", 3),
  product("T/O袋 大", "テイク資材 No.4", "枚", 0),
  product("T/O容器 白", "テイク資材 No.4", "個", 30),
  product("T/O容器 弁当本体＋蓋", "テイク資材 No.4", "個", 26),
  product("タレビン 小", "テイク資材 No.4", "個", 6),
  product("タレビン 角中", "テイク資材 No.4", "個", 9),
  product("卓上 ラー油", "卓上", "個", 0),
  product("卓上 冷水ウーロン茶", "卓上", "個", 0),
  product("卓上 ホワイトペッパー", "卓上", "個", 0),
  product("卓上 秘伝・赤みそ", "卓上", "個", 0),
  product("卓上 りんご酢", "卓上", "個", 0),
  product("卓上 穀物酢", "卓上", "個", 0),
  product("卓上 餃子のたれ", "卓上", "個", 0),
  product("卓上 ブラックペッパー", "卓上", "個", 0),
  product("卓上 紅生姜千切", "卓上", "個", 0),
  product("卓上 風風からし高菜", "卓上", "個", 0),
  product("卓上 山椒", "卓上", "個", 0)
];

function product(name, category, unit, price) {
  const key = `${category}-${name}-${unit}`;
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }
  return { id: `sheet-${hash.toString(36)}`, name, category, unit, price };
}

const formatter = new Intl.NumberFormat("ja-JP");
const currency = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0
});

let state = loadState();
let selectedProductId = state.products[0]?.id ?? null;
let isDirty = false;
let recognition = null;
let currentLanguage = getInitialLanguage();
let toastTimer = null;
let calculatorExpression = "";

const elements = {
  saveStatus: document.querySelector("#saveStatus"),
  currentStoreName: document.querySelector("#currentStoreName"),
  saveAllButton: document.querySelector("#saveAllButton"),
  draftSaveButton: document.querySelector("#draftSaveButton"),
  openQrButton: document.querySelector("#openQrButton"),
  copyQrUrlButton: document.querySelector("#copyQrUrlButton"),
  closeQrButton: document.querySelector("#closeQrButton"),
  closeQrBackdrop: document.querySelector("#closeQrBackdrop"),
  qrModal: document.querySelector("#qrModal"),
  entryModal: document.querySelector("#entryModal"),
  closeEntryButton: document.querySelector("#closeEntryButton"),
  closeEntryBackdrop: document.querySelector("#closeEntryBackdrop"),
  entryModalTitle: document.querySelector("#entryModalTitle"),
  modalCategory: document.querySelector("#modalCategory"),
  modalUnit: document.querySelector("#modalUnit"),
  modalPrice: document.querySelector("#modalPrice"),
  modalAmount: document.querySelector("#modalAmount"),
  modalQuantityInput: document.querySelector("#modalQuantityInput"),
  modalAddQuantityInput: document.querySelector("#modalAddQuantityInput"),
  modalSaveButton: document.querySelector("#modalSaveButton"),
  languageButtons: document.querySelectorAll("[data-lang]"),
  tabs: document.querySelectorAll(".tab"),
  screens: document.querySelectorAll(".screen"),
  productSearch: document.querySelector("#productSearch"),
  productList: document.querySelector("#productList"),
  selectedName: document.querySelector("#selectedName"),
  selectedCategory: document.querySelector("#selectedCategory"),
  selectedUnit: document.querySelector("#selectedUnit"),
  selectedPrice: document.querySelector("#selectedPrice"),
  selectedAmount: document.querySelector("#selectedAmount"),
  quantityInput: document.querySelector("#quantityInput"),
  addQuantityInput: document.querySelector("#addQuantityInput"),
  saveSelectedButton: document.querySelector("#saveSelectedButton"),
  productForm: document.querySelector("#productForm"),
  editingProductId: document.querySelector("#editingProductId"),
  masterName: document.querySelector("#masterName"),
  masterCategory: document.querySelector("#masterCategory"),
  masterUnit: document.querySelector("#masterUnit"),
  categoryOptions: document.querySelector("#categoryOptions"),
  unitOptions: document.querySelector("#unitOptions"),
  categoryPickerButton: document.querySelector("#categoryPickerButton"),
  unitPickerButton: document.querySelector("#unitPickerButton"),
  categoryPickerMenu: document.querySelector("#categoryPickerMenu"),
  unitPickerMenu: document.querySelector("#unitPickerMenu"),
  masterPrice: document.querySelector("#masterPrice"),
  cancelEditButton: document.querySelector("#cancelEditButton"),
  storeProgressBody: document.querySelector("#storeProgressBody"),
  storeRoleList: document.querySelector("#storeRoleList"),
  exportStoreCsvButton: document.querySelector("#exportStoreCsvButton"),
  exportAllCsvButton: document.querySelector("#exportAllCsvButton"),
  publishMasterButton: document.querySelector("#publishMasterButton"),
  masterTableBody: document.querySelector("#masterTableBody"),
  totalAmount: document.querySelector("#totalAmount"),
  countedItems: document.querySelector("#countedItems"),
  missingItems: document.querySelector("#missingItems"),
  lastClosedTotal: document.querySelector("#lastClosedTotal"),
  lastClosedDate: document.querySelector("#lastClosedDate"),
  monthlyCloseButton: document.querySelector("#monthlyCloseButton"),
  monthlyHistoryBody: document.querySelector("#monthlyHistoryBody"),
  monthlyHistoryCsvButton: document.querySelector("#monthlyHistoryCsvButton"),
  toastMessage: document.querySelector("#toastMessage"),
  tabletopTotalCost: document.querySelector("#tabletopTotalCost"),
  tabletopCsvButton: document.querySelector("#tabletopCsvButton"),
  tabletopTableBody: document.querySelector("#tabletopTableBody"),
  fryOilTableBody: document.querySelector("#fryOilTableBody"),
  summaryTableBody: document.querySelector("#summaryTableBody"),
  summaryCsvButton: document.querySelector("#summaryCsvButton"),
  missingList: document.querySelector("#missingList"),
  openCalculatorButton: document.querySelector("#openCalculatorButton"),
  calculatorModal: document.querySelector("#calculatorModal"),
  closeCalculatorButton: document.querySelector("#closeCalculatorButton"),
  closeCalculatorBackdrop: document.querySelector("#closeCalculatorBackdrop"),
  calculatorDisplay: document.querySelector("#calculatorDisplay"),
  calculatorGrid: document.querySelector(".calculator-grid")
};

function getInitialLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (messages[saved]) return saved;

  const browserLanguage = (navigator.language || "").toLowerCase();
  if (browserLanguage.startsWith("my")) return "my";
  if (browserLanguage.startsWith("vi")) return "vi";
  return "ja";
}

function t(key, replacements = {}) {
  const template = messages[currentLanguage][key] ?? messages.ja[key] ?? key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template
  );
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "ja" ? "ja" : currentLanguage;
  document.title = t("appTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", t(node.dataset.i18nAlt));
  });
  elements.languageButtons.forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(saved);
    return normalizeState(parsed);
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  return normalizeState({ products: defaultProducts, counts: {}, tabletop: {}, savedAt: null });
}

function createLocalId(prefix = "id") {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${randomPart}`;
}

function normalizeState(value = {}) {
  return {
    products: Array.isArray(value.products) ? value.products : defaultProducts,
    counts: value.counts && typeof value.counts === "object" ? value.counts : {},
    countUpdatedAt: value.countUpdatedAt && typeof value.countUpdatedAt === "object" ? value.countUpdatedAt : {},
    tabletop: value.tabletop && typeof value.tabletop === "object" ? value.tabletop : {},
    tabletopUpdatedAt: value.tabletopUpdatedAt && typeof value.tabletopUpdatedAt === "object" ? value.tabletopUpdatedAt : {},
    routeTransitions: value.routeTransitions && typeof value.routeTransitions === "object" ? value.routeTransitions : {},
    lastConfirmedProductId: value.lastConfirmedProductId ?? null,
    productsUpdatedAt: value.productsUpdatedAt ?? null,
    savedAt: value.savedAt ?? null,
    inventoryArchives: Array.isArray(value.inventoryArchives) ? value.inventoryArchives : [],
    currentStoreId: value.currentStoreId ?? "asaka",
    currentStoreName: value.currentStoreName ?? "朝霞東口店",
    isAdmin: value.isAdmin ?? true,
    storeProgress: value.storeProgress && typeof value.storeProgress === "object" ? value.storeProgress : {}
  };
}

function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);
  if (!clientId) {
    clientId = createLocalId("client");
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }
  return clientId;
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function persistState(options = {}) {
  if (options.rolloverTabletop) {
    rolloverTabletopInventory();
  }
  state.savedAt = new Date().toISOString();
  saveLocalState();
  queueSyncState();
  isDirty = false;
  renderTabletop();
  syncWithServer();
  if (options.silent) {
    return;
  }
  if (options.draft) {
    elements.saveStatus.textContent = t("draftSavedAt", { date: new Date(state.savedAt).toLocaleString("ja-JP") });
  } else {
    updateSaveStatus();
  }
}

function saveDraft() {
  persistState({ draft: true });
}

function hasMissingInventoryInputs() {
  return state.products.some((product) => getQuantity(product.id) === null);
}

function finalizeSave() {
  if (hasMissingInventoryInputs()) {
    persistState({ draft: true, silent: true });
    elements.saveStatus.textContent = t("incompleteSaveWarning");
    return;
  }

  persistState({ rolloverTabletop: true });
}

function rolloverTabletopInventory() {
  const updatedAt = new Date().toISOString();
  Object.entries(state.tabletop).forEach(([itemId, entry]) => {
    if (entry.current === "" || entry.current === null || entry.current === undefined) return;
    state.tabletop[itemId] = {
      last: entry.current,
      purchase: "",
      current: ""
    };
    state.tabletopUpdatedAt[`${itemId}.last`] = updatedAt;
    state.tabletopUpdatedAt[`${itemId}.purchase`] = updatedAt;
    state.tabletopUpdatedAt[`${itemId}.current`] = updatedAt;
  });
}

function markDirty(message = t("unsaved")) {
  isDirty = true;
  elements.saveStatus.textContent = message;
}

function updateSaveStatus() {
  if (isDirty) return;
  const savedText = state.savedAt
    ? t("savedAt", { date: new Date(state.savedAt).toLocaleString("ja-JP") })
    : t("noUnsaved");
  elements.saveStatus.textContent = savedText;
}

function queueSyncState() {
  localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify({
    clientId: getClientId(),
    queuedAt: new Date().toISOString(),
    state
  }));
}

function clearPendingSync() {
  localStorage.removeItem(PENDING_SYNC_KEY);
}

function getPendingSync() {
  const pending = localStorage.getItem(PENDING_SYNC_KEY);
  if (!pending) return null;

  try {
    return JSON.parse(pending);
  } catch {
    clearPendingSync();
    return null;
  }
}

function getTimestamp(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : 0;
}

function mergeRemoteState(remoteValue) {
  const remote = normalizeState(remoteValue);
  const pending = getPendingSync();
  if (pending?.state?.currentStoreId && pending.state.currentStoreId !== remote.currentStoreId) {
    clearPendingSync();
  }
  const storeChanged = state.currentStoreId && state.currentStoreId !== remote.currentStoreId;
  const localProductsTime = getTimestamp(state.productsUpdatedAt);
  const remoteProductsTime = getTimestamp(remote.productsUpdatedAt);

  if (remoteProductsTime > localProductsTime) {
    state.products = remote.products;
    state.productsUpdatedAt = remote.productsUpdatedAt;
    if (!state.products.some((product) => product.id === selectedProductId)) {
      selectedProductId = state.products[0]?.id ?? null;
    }
  }

  if (storeChanged) {
    state.counts = { ...remote.counts };
    state.countUpdatedAt = { ...remote.countUpdatedAt };
    state.tabletop = JSON.parse(JSON.stringify(remote.tabletop || {}));
    state.tabletopUpdatedAt = { ...remote.tabletopUpdatedAt };
    state.inventoryArchives = [...remote.inventoryArchives];
    state.routeTransitions = {};
    state.lastConfirmedProductId = null;
    state.savedAt = remote.savedAt;
    state.currentStoreId = remote.currentStoreId;
    state.currentStoreName = remote.currentStoreName;
    state.isAdmin = remote.isAdmin;
    state.storeProgress = remote.storeProgress;
    selectedProductId = state.products[0]?.id ?? null;
    isDirty = false;
    saveLocalState();
    renderAll();
    return;
  }

  Object.entries(remote.counts).forEach(([productId, quantity]) => {
    const remoteTime = getTimestamp(remote.countUpdatedAt[productId]);
    const localTime = getTimestamp(state.countUpdatedAt[productId]);
    if (remoteTime > localTime) {
      state.counts[productId] = quantity;
      state.countUpdatedAt[productId] = remote.countUpdatedAt[productId];
    }
  });

  Object.keys(remote.countUpdatedAt).forEach((productId) => {
    const remoteTime = getTimestamp(remote.countUpdatedAt[productId]);
    const localTime = getTimestamp(state.countUpdatedAt[productId]);
    if (remoteTime > localTime && !Object.prototype.hasOwnProperty.call(remote.counts, productId)) {
      delete state.counts[productId];
      state.countUpdatedAt[productId] = remote.countUpdatedAt[productId];
    }
  });

  Object.entries(remote.tabletop).forEach(([itemId, entry]) => {
    const mergedEntry = { ...getTabletopEntry(itemId) };
    ["last", "purchase", "current"].forEach((field) => {
      const key = `${itemId}.${field}`;
      const remoteTime = getTimestamp(remote.tabletopUpdatedAt[key]);
      const localTime = getTimestamp(state.tabletopUpdatedAt[key]);
      if (remoteTime > localTime) {
        mergedEntry[field] = entry?.[field] ?? "";
        state.tabletopUpdatedAt[key] = remote.tabletopUpdatedAt[key];
      }
    });
    state.tabletop[itemId] = mergedEntry;
  });

  if (getTimestamp(remote.savedAt) > getTimestamp(state.savedAt)) {
    state.savedAt = remote.savedAt;
  }

  if (getLatestArchiveTime(remote.inventoryArchives) > getLatestArchiveTime(state.inventoryArchives)) {
    state.inventoryArchives = [...remote.inventoryArchives];
  }

  state.currentStoreId = remote.currentStoreId;
  state.currentStoreName = remote.currentStoreName;
  state.isAdmin = remote.isAdmin;
  state.storeProgress = remote.storeProgress;

  saveLocalState();
  renderAll();
}

function replaceLocalState(remoteValue) {
  const remote = normalizeState(remoteValue);
  state.products = remote.products;
  state.productsUpdatedAt = remote.productsUpdatedAt;
  state.counts = { ...remote.counts };
  state.countUpdatedAt = { ...remote.countUpdatedAt };
  state.tabletop = JSON.parse(JSON.stringify(remote.tabletop || {}));
  state.tabletopUpdatedAt = { ...remote.tabletopUpdatedAt };
  state.inventoryArchives = [...remote.inventoryArchives];
  state.savedAt = remote.savedAt;
  state.currentStoreId = remote.currentStoreId;
  state.currentStoreName = remote.currentStoreName;
  state.isAdmin = remote.isAdmin;
  state.storeProgress = remote.storeProgress;
  state.routeTransitions = {};
  state.lastConfirmedProductId = null;
  selectedProductId = state.products[0]?.id ?? null;
  saveLocalState();
  renderAll();
}

function getLatestArchiveTime(archives = []) {
  return archives
    .map((archive) => getTimestamp(archive.closedAt))
    .filter(Boolean)
    .sort((a, b) => b - a)[0] || 0;
}

async function syncWithServer(options = {}) {
  if (!navigator.onLine) {
    if (!options.silent && !isDirty) elements.saveStatus.textContent = t("offlinePending");
    return;
  }

  try {
    let response;
    const pending = getPendingSync();
    if (pending && !options.pullOnly) {
      response = await fetch("./api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending)
      });
    } else {
      response = await fetch("./api/state");
    }

    if (!response.ok) throw new Error(`Sync failed: ${response.status}`);
    const payload = await response.json();
    if (payload.state) mergeRemoteState(payload.state);
    if (pending && !options.pullOnly) clearPendingSync();
    if (!isDirty) {
      elements.saveStatus.textContent = t("onlineSynced", { date: new Date().toLocaleString("ja-JP") });
    }
  } catch {
    if (!isDirty) elements.saveStatus.textContent = t("syncFailed");
  }
}

function updateConnectionStatus() {
  if (navigator.onLine) {
    syncWithServer({ silent: true });
    return;
  }
  if (!isDirty) elements.saveStatus.textContent = t("offlineReady");
}

function registerOfflineSupport() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  window.addEventListener("online", () => syncWithServer());
  window.addEventListener("offline", updateConnectionStatus);
  setInterval(() => syncWithServer({ silent: true }), SYNC_INTERVAL_MS);
}

function getSelectedProduct() {
  return state.products.find((product) => product.id === selectedProductId) ?? null;
}

function getQuantity(productId) {
  const value = state.counts[productId];
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function parseQuantityInput(value) {
  if (value === "" || value === null || value === undefined) return null;
  const quantity = Number(value);
  return Number.isFinite(quantity) ? quantity : null;
}

function getQuantityAfterAddition(product, quantityInput, addInput) {
  const baseInput = parseQuantityInput(quantityInput.value);
  const savedBase = getQuantity(product.id);
  const additionInput = parseQuantityInput(addInput.value);
  if (baseInput === null && savedBase === null && additionInput === null) return null;
  return (baseInput ?? savedBase ?? 0) + (additionInput ?? 0);
}

function formatQuantity(value) {
  if (value === null || value === undefined || value === "") return "";
  return Number(value) % 1 === 0 ? String(Number(value)) : String(Number(value));
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/\s/g, "");
}

function getSearchTargets(product) {
  const base = [
    product.name,
    getTranslatedProductName(product),
    product.category,
    `${product.name}${product.category}`,
    kanaReadingMap[product.name]
  ].filter(Boolean);

  return base.map(normalizeSearchText);
}

function getVisibleCategory(product) {
  return product.category === "食材 No.1" ? "" : product.category;
}

function renderProductMeta(product) {
  const category = getVisibleCategory(product);
  return category ? `${category} / ${product.unit}` : product.unit;
}

function getTranslatedProductName(product) {
  if (currentLanguage === "ja") return "";
  return productTranslations[product.name]?.[currentLanguage] ?? buildTentativeProductTranslation(product);
}

function renderProductName(product) {
  const translatedName = getTranslatedProductName(product);
  const translatedHtml = translatedName
    ? `<span class="translated-name">(${escapeHtml(translatedName)})</span>`
    : "";
  return `<strong>${escapeHtml(product.name)}</strong>${translatedHtml}`;
}

function buildTentativeProductTranslation(product) {
  if (currentLanguage === "vi") {
    return `Tạm dịch: ${translateProductNameByParts(product.name, "vi")}`;
  }
  if (currentLanguage === "my") {
    return `ယာယီ: ${translateProductNameByParts(product.name, "my")}`;
  }
  return "";
}

function translateProductNameByParts(name, language) {
  const dictionary = productTermTranslations[language] ?? {};
  let translated = name;
  Object.entries(dictionary)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([source, target]) => {
      translated = translated.replaceAll(source, target);
    });
  return translated;
}

const kanaReadingMap = {
  "北の味噌": "きたのみそ",
  "リズム焙煎味噌ラーメンスープ": "りずむばいせんみそらーめんすーぷ",
  "トンコツかえし": "とんこつかえし",
  "リズム醤油かえし": "りずむしょうゆかえし",
  "塩かえし": "しおかえし",
  "麺ストレート": "めんすとれーと",
  "麺ウェーブ細": "めんうぇーぶほそ",
  "麺ウェーブ太": "めんうぇーぶふと",
  "無洗米(UCC/種商)": "むせんまいうっしーしゅしょう",
  "米(地場仕入)": "こめじばしいれ",
  "万能調味料": "ばんのうちょうみりょう",
  "薄口醤油": "うすくちしょうゆ",
  "リズム旨味タレ": "りずむうまみたれ",
  "ポークオイルAT": "ぽーくおいるえーてぃー",
  "コーン＆キャノーラ": "こーんきゃのーら",
  "落花生油": "らっかせいあぶら",
  "ガーリックオイル": "がーりっくおいる",
  "特製ネギ油": "とくせいねぎあぶら",
  "ラー油": "らーゆ",
  "ポリごま油": "ぽりごまあぶら",
  "旨味脂": "うまみあぶら",
  "マー油": "まーゆ",
  "和ぶしオイル": "わぶしおいる",
  "唐揚げつけ込みのタレ": "からあげつけこみのたれ",
  "冷し中華ごまぴり辛": "ひやしちゅうかごまぴりから",
  "冷やし中華醤油ダレ": "ひやしちゅうかしょうゆだれ",
  "冷し中華梅タレ": "ひやしちゅうかうめたれ",
  "油そばのたれ": "あぶらそばのたれ",
  "つけ麺タレ": "つけめんたれ",
  "担々ラー油": "たんたんらーゆ",
  "まぶし粉": "まぶしこ",
  "バッター粉": "ばったーこ",
  "片栗粉": "かたくりこ",
  "味付メンマ": "あじつけめんま",
  "リズム焼飯": "りずむやきめし",
  "焼海苔": "やきのり",
  "つぼ漬け": "つぼづけ",
  "カリカリガーリック": "かりかりがーりっく",
  "バター": "ばたー",
  "とんこつスープ": "とんこつすーぷ",
  "PBガラーNS 1010": "ぴーびーがらーえぬえす",
  "茹で餃子": "ゆでぎょうざ",
  "焼き餃子": "やきぎょうざ",
  "スーパースイートコーン": "すーぱーすいーとこーん",
  "鶏モモ肉": "とりももにく",
  "風風パーコー": "ふうふうぱーこー",
  "チャーシュー": "ちゃーしゅー",
  "ソーセージ": "そーせーじ",
  "まろやか鶏白湯": "まろやかとりぱいたん",
  "肉そぼろ": "にくそぼろ",
  "きぬさや": "きぬさや",
  "ポテト": "ぽてと",
  "春巻き 10本": "はるまき",
  "軟骨の唐揚げ": "なんこつのからあげ",
  "クレープ苺ミルク": "くれーぷいちごみるく",
  "クレープチョコバナナ": "くれーぷちょこばなな",
  "クレープWチョコ": "くれーぷだぶるちょこ",
  "T/O容器ラーメン 本体": "ていくあうとようきらーめんほんたい",
  "T/O容器ラーメン 中皿": "ていくあうとようきらーめんなかざら",
  "T/O容器ラーメン 蓋": "ていくあうとようきらーめんふた",
  "T/O容器 白": "ていくあうとようきしろ",
  "T/O容器 弁当本体＋蓋": "ていくあうとようきべんとうほんたいふた",
  "トマト": "とまと",
  "キューリ": "きゅーり",
  "大葉": "おおば",
  "梅だれ 1.1kg": "うめだれ",
  "おにぎりの素 かりかり梅500g": "おにぎりのもとかりかりうめ",
  "手羽先": "てばさき",
  "手羽先のタレ": "てばさきのたれ",
  "にんにく唐辛子": "にんにくとうがらし",
  "輪切り唐辛子": "わぎりとうがらし",
  "山椒": "さんしょう",
  "おろし生姜": "おろししょうが",
  "おろしにんにく": "おろしにんにく",
  "冷水ウーロン茶": "れいすいうーろんちゃ",
  "ホワイトペッパー": "ほわいとぺっぱー",
  "秘伝・赤みそ": "ひでんあかみそ",
  "りんご酢": "りんごす",
  "穀物酢": "こくもつす",
  "餃子のたれ": "ぎょうざのたれ",
  "ブラックペッパー": "ぶらっくぺっぱー",
  "紅生姜千切": "べにしょうがせんぎり",
  "風風からし高菜": "ふうふうからしたかな",
  "中力粉(日清 雪)": "ちゅうりきこにっしんゆき",
  "ケチャップ": "けちゃっぷ",
  "いりゴマ（白）": "いりごましろ",
  "塩": "しお",
  "上白砂糖": "じょうはくさとう",
  "マヨネーズ": "まよねーず",
  "からし": "からし",
  "黒胡麻": "くろごま",
  "カット白髪ねぎ": "かっとしらがねぎ",
  "青ねぎ": "あおねぎ",
  "白ねぎ 小口切": "しろねぎこぐちぎり",
  "もやし": "もやし",
  "卵": "たまご",
  "サニーレタス": "さにーれたす",
  "唐揚げ仕込": "からあげしこみ",
  "味噌ダレ仕込み": "みそだれしこみ",
  "カキフライ": "かきふらい",
  "練り胡麻": "ねりごま",
  "酢豚ソース": "すぶたそーす",
  "タルタルソース": "たるたるそーす",
  "チリパウダー": "ちりぱうだー",
  "明太子(ばらこ)": "めんたいこばらこ",
  "豆板醤": "とうばんじゃん",
  "豆乳鍋スープ": "とうにゅうなべすーぷ",
  "トマトガーリック": "とまとがーりっく",
  "ゴマドレッシング": "ごまどれっしんぐ",
  "食研つゆ": "しょっけんつゆ",
  "ほぐし鶏": "ほぐしどり",
  "オイスターソース815": "おいすたーそーす",
  "激辛四川ラー油": "げきからしせんらーゆ",
  "赤マー油": "あかまーゆ",
  "パワフル": "ぱわふる",
  "ポッカレモン": "ぽっかれもん",
  "オレンジ": "おれんじ",
  "コーラ": "こーら",
  "ドライゼロ（30本）": "どらいぜろ",
  "スーパードライ": "すーぱーどらい",
  "瓶ビール（20本）": "びんびーる",
  "ガスボンベ": "がすぼんべ",
  "とんこつ": "とんこつ",
  "しょうゆ": "しょうゆ",
  "みそ": "みそ",
  "しお": "しお",
  "担々": "たんたん",
  "つけ麺": "つけめん",
  "混合油": "こんごうあぶら",
  "油そばの油": "あぶらそばのあぶら",
  "煮玉子": "にたまご",
  "煮玉子タレ": "にたまごたれ",
  "南蛮タレ": "なんばんたれ",
  "T/O容器ラーメン本体": "ていくあうとようきらーめんほんたい",
  "T/O容器ラーメン中皿": "ていくあうとようきらーめんなかざら",
  "T/O容器ラーメン蓋": "ていくあうとようきらーめんふた",
  "T/O袋 小": "ていくあうとふくろしょう",
  "T/O袋 中(弁当)": "ていくあうとふくろちゅうべんとう",
  "T/O袋 大": "ていくあうとふくろだい",
  "タレビン 小": "たれびんしょう",
  "タレビン 角中": "たれびんかくちゅう",
  "卓上 ラー油": "たくじょうらーゆ",
  "卓上 冷水ウーロン茶": "たくじょうれいすいうーろんちゃ",
  "卓上 ホワイトペッパー": "たくじょうほわいとぺっぱー",
  "卓上 秘伝・赤みそ": "たくじょうひでんあかみそ",
  "卓上 りんご酢": "たくじょうりんごす",
  "卓上 穀物酢": "たくじょうこくもつす",
  "卓上 餃子のたれ": "たくじょうぎょうざのたれ",
  "卓上 ブラックペッパー": "たくじょうぶらっくぺっぱー",
  "卓上 紅生姜千切": "たくじょうべにしょうがせんぎり",
  "卓上 風風からし高菜": "たくじょうふうふうからしたかな",
  "卓上 山椒": "たくじょうさんしょう"
};

const productTranslations = {
  "北の味噌": {
    my: "မြောက်ပိုင်း မီဆို",
    vi: "Miso miền Bắc"
  },
  "チャーシュー": {
    my: "ချာရှူး",
    vi: "Thịt xá xíu"
  },
  "ラー油": {
    my: "ဆီငရုတ်",
    vi: "Dầu ớt"
  },
  "米(地場仕入)": {
    my: "ဆန်",
    vi: "Gạo"
  },
  "鶏モモ肉": {
    my: "ကြက်ပေါင်သား",
    vi: "Thịt đùi gà"
  },
  "卵": {
    my: "ကြက်ဥ",
    vi: "Trứng"
  },
  "もやし": {
    my: "ပဲပင်ပေါက်",
    vi: "Giá đỗ"
  },
  "青ねぎ": {
    my: "ကြက်သွန်မြိတ်",
    vi: "Hành lá"
  },
  "瓶ビール（20本）": {
    my: "ပုလင်းဘီယာ",
    vi: "Bia chai"
  }
};

const productTermTranslations = {
  vi: {
    "北の味噌": "Miso miền Bắc",
    "リズム": "Rhythm",
    "焙煎": "rang",
    "味噌": "miso",
    "ラーメン": "ramen",
    "スープ": "súp",
    "トンコツ": "nước cốt xương heo",
    "とんこつ": "xương heo",
    "かえし": "nước gia vị",
    "醤油": "nước tương",
    "しょうゆ": "nước tương",
    "塩": "muối",
    "麺": "mì",
    "ストレート": "thẳng",
    "ウェーブ": "gợn sóng",
    "細": "nhỏ",
    "太": "to",
    "無洗米": "gạo không cần vo",
    "米": "gạo",
    "万能調味料": "gia vị đa dụng",
    "薄口": "vị nhạt",
    "旨味": "umami",
    "タレ": "nước sốt",
    "たれ": "nước sốt",
    "ポーク": "heo",
    "オイル": "dầu",
    "コーン": "bắp",
    "キャノーラ": "canola",
    "落花生油": "dầu đậu phộng",
    "ガーリック": "tỏi",
    "特製": "đặc chế",
    "ネギ": "hành",
    "ラー油": "dầu ớt",
    "ごま油": "dầu mè",
    "脂": "mỡ",
    "マー油": "dầu tỏi đen",
    "和ぶし": "cá bào Nhật",
    "唐揚げ": "gà chiên",
    "つけ込み": "ướp",
    "冷し中華": "mì lạnh Trung Hoa",
    "ごま": "mè",
    "ぴり辛": "cay nhẹ",
    "梅": "mơ muối",
    "油そば": "mì dầu",
    "つけ麺": "mì chấm",
    "担々": "tantan",
    "まぶし粉": "bột phủ",
    "バッター粉": "bột nhúng",
    "片栗粉": "bột khoai tây",
    "味付": "tẩm vị",
    "メンマ": "măng menma",
    "焼飯": "cơm chiên",
    "焼": "nướng",
    "海苔": "rong biển",
    "つぼ漬け": "dưa muối",
    "カリカリ": "giòn",
    "バター": "bơ",
    "餃子": "gyoza",
    "茹で": "luộc",
    "スーパースイートコーン": "bắp ngọt",
    "鶏": "gà",
    "モモ肉": "thịt đùi",
    "パーコー": "sườn chiên",
    "チャーシュー": "thịt xá xíu",
    "ソーセージ": "xúc xích",
    "白湯": "paitan",
    "肉そぼろ": "thịt băm",
    "きぬさや": "đậu Hà Lan non",
    "ポテト": "khoai tây",
    "春巻き": "chả giò",
    "軟骨": "sụn",
    "クレープ": "bánh crepe",
    "苺": "dâu",
    "ミルク": "sữa",
    "チョコ": "sô cô la",
    "バナナ": "chuối",
    "容器": "hộp",
    "本体": "thân",
    "中皿": "khay giữa",
    "蓋": "nắp",
    "弁当": "cơm hộp",
    "トマト": "cà chua",
    "キューリ": "dưa leo",
    "大葉": "lá shiso",
    "梅だれ": "sốt mơ",
    "おにぎり": "cơm nắm",
    "素": "nguyên liệu",
    "手羽先": "cánh gà",
    "にんにく": "tỏi",
    "唐辛子": "ớt",
    "輪切り": "cắt khoanh",
    "山椒": "tiêu sansho",
    "おろし": "xay",
    "生姜": "gừng",
    "冷水": "nước lạnh",
    "ウーロン茶": "trà ô long",
    "ホワイトペッパー": "tiêu trắng",
    "秘伝": "bí truyền",
    "赤みそ": "miso đỏ",
    "りんご酢": "giấm táo",
    "穀物酢": "giấm ngũ cốc",
    "ブラックペッパー": "tiêu đen",
    "紅生姜": "gừng đỏ",
    "千切": "thái sợi",
    "からし高菜": "cải takana cay",
    "中力粉": "bột mì trung lực",
    "ケチャップ": "tương cà",
    "いりゴマ": "mè rang",
    "上白砂糖": "đường trắng",
    "マヨネーズ": "mayonnaise",
    "からし": "mù tạt",
    "黒胡麻": "mè đen",
    "カット": "cắt sẵn",
    "白髪ねぎ": "hành thái sợi",
    "青ねぎ": "hành lá",
    "白ねぎ": "hành trắng",
    "小口切": "cắt khoanh nhỏ",
    "もやし": "giá đỗ",
    "卵": "trứng",
    "サニーレタス": "xà lách",
    "仕込": "sơ chế",
    "カキフライ": "hàu chiên",
    "練り胡麻": "mè nghiền",
    "酢豚": "thịt chua ngọt",
    "タルタルソース": "sốt tartar",
    "チリパウダー": "bột ớt",
    "明太子": "trứng cá cay",
    "豆板醤": "tương đậu cay",
    "豆乳": "sữa đậu nành",
    "鍋": "lẩu",
    "ドレッシング": "nước sốt salad",
    "つゆ": "nước dùng",
    "ほぐし": "xé",
    "オイスターソース": "dầu hào",
    "激辛": "rất cay",
    "四川": "Tứ Xuyên",
    "赤": "đỏ",
    "ポッカレモン": "nước chanh Pokka",
    "オレンジ": "cam",
    "コーラ": "cola",
    "ドライゼロ": "Dry Zero",
    "スーパードライ": "Super Dry",
    "瓶ビール": "bia chai",
    "ガスボンベ": "bình gas",
    "混合油": "dầu trộn",
    "煮玉子": "trứng ngâm",
    "南蛮": "nanban",
    "袋": "túi",
    "タレビン": "chai nhỏ đựng sốt",
    "卓上": "đồ để bàn"
  },
  my: {
    "北の味噌": "မြောက်ပိုင်း မီဆို",
    "リズム": "Rhythm",
    "焙煎": "လှော်",
    "味噌": "မီဆို",
    "ラーメン": "ရာမင်",
    "スープ": "စွပ်ပြုတ်",
    "トンコツ": "ဝက်အရိုးစွပ်",
    "とんこつ": "ဝက်အရိုး",
    "かえし": "အရသာဆော့စ်",
    "醤油": "ပဲငံပြာရည်",
    "しょうゆ": "ပဲငံပြာရည်",
    "塩": "ဆား",
    "麺": "ခေါက်ဆွဲ",
    "ストレート": "ဖြောင့်",
    "ウェーブ": "လှိုင်း",
    "細": "သေး",
    "太": "ကြီး",
    "無洗米": "မဆေးရသောဆန်",
    "米": "ဆန်",
    "万能調味料": "အသုံးများသောဟင်းခတ်",
    "薄口": "အရသာပေါ့",
    "旨味": "အရသာရှိ",
    "タレ": "ဆော့စ်",
    "たれ": "ဆော့စ်",
    "ポーク": "ဝက်",
    "オイル": "ဆီ",
    "コーン": "ပြောင်း",
    "キャノーラ": "ကနိုလာ",
    "落花生油": "မြေပဲဆီ",
    "ガーリック": "ကြက်သွန်ဖြူ",
    "特製": "အထူး",
    "ネギ": "ကြက်သွန်မြိတ်",
    "ラー油": "ငရုတ်ဆီ",
    "ごま油": "နှမ်းဆီ",
    "脂": "အဆီ",
    "マー油": "ကြက်သွန်ဖြူဆီ",
    "和ぶし": "ဂျပန်ငါးခြောက်",
    "唐揚げ": "ကြက်ကြော်",
    "つけ込み": "နှပ်",
    "冷し中華": "အေးခေါက်ဆွဲ",
    "ごま": "နှမ်း",
    "ぴり辛": "နည်းနည်းစပ်",
    "梅": "ဇီးချဉ်",
    "油そば": "ဆီခေါက်ဆွဲ",
    "つけ麺": "တို့စားခေါက်ဆွဲ",
    "担々": "တန်တန်",
    "まぶし粉": "ဖြူးရန်မှုန့်",
    "バッター粉": "ကြော်မှုန့်",
    "片栗粉": "အာလူးကော်မှုန့်",
    "味付": "အရသာထည့်",
    "メンマ": "မင်မာ",
    "焼飯": "ထမင်းကြော်",
    "焼": "ကင်",
    "海苔": "နိုရီ",
    "つぼ漬け": "ချဉ်ဖတ်",
    "カリカリ": "ကြွပ်",
    "バター": "ထောပတ်",
    "餃子": "ဂျော်ဇာ",
    "茹で": "ပြုတ်",
    "スーパースイートコーン": "ချိုပြောင်း",
    "鶏": "ကြက်",
    "モモ肉": "ပေါင်သား",
    "パーコー": "ကြော်နံရိုး",
    "チャーシュー": "ချာရှူး",
    "ソーセージ": "ဆော့ဆေ့",
    "白湯": "ပိုင်တန်",
    "肉そぼろ": "အသားနုပ်",
    "きぬさや": "ပဲတောင့်နု",
    "ポテト": "အာလူး",
    "春巻き": "စပရင်းရိုး",
    "軟骨": "နုရိုး",
    "クレープ": "ကရိပ်",
    "苺": "စတော်ဘယ်ရီ",
    "ミルク": "နို့",
    "チョコ": "ချောကလက်",
    "バナナ": "ငှက်ပျော",
    "容器": "ဘူး",
    "本体": "ကိုယ်ထည်",
    "中皿": "အလယ်ခွက်",
    "蓋": "အဖုံး",
    "弁当": "ဘန်တို",
    "トマト": "ခရမ်းချဉ်သီး",
    "キューリ": "သခွားသီး",
    "大葉": "ရှီဆိုရွက်",
    "梅だれ": "ဇီးဆော့စ်",
    "おにぎり": "အိုနီဂီရီ",
    "素": "အခြေခံပစ္စည်း",
    "手羽先": "ကြက်တောင်ပံ",
    "にんにく": "ကြက်သွန်ဖြူ",
    "唐辛子": "ငရုတ်သီး",
    "輪切り": "ဝိုင်းလှီး",
    "山椒": "ဆန်ရှို",
    "おろし": "ခြစ်",
    "生姜": "ဂျင်း",
    "冷水": "ရေအေး",
    "ウーロン茶": "အူလုံလက်ဖက်ရည်",
    "ホワイトペッパー": "ငရုတ်ကောင်းဖြူ",
    "秘伝": "လျှို့ဝှက်ချက်",
    "赤みそ": "မီဆိုနီ",
    "りんご酢": "ပန်းသီးရှလကာရည်",
    "穀物酢": "စပါးရှလကာရည်",
    "ブラックペッパー": "ငရုတ်ကောင်းနက်",
    "紅生姜": "ဂျင်းနီ",
    "千切": "ပါးပါးလှီး",
    "からし高菜": "မုန်ညင်းရွက်စပ်",
    "中力粉": "ဂျုံမှုန့်အလယ်စား",
    "ケチャップ": "ခရမ်းချဉ်သီးဆော့စ်",
    "いりゴマ": "လှော်နှမ်း",
    "上白砂糖": "သကြားဖြူ",
    "マヨネーズ": "မယိုနိစ်",
    "からし": "မုန်ညင်း",
    "黒胡麻": "နှမ်းနက်",
    "カット": "လှီးပြီး",
    "白髪ねぎ": "ကြက်သွန်မြိတ်ပါးပါး",
    "青ねぎ": "ကြက်သွန်မြိတ်",
    "白ねぎ": "ကြက်သွန်မြိတ်ဖြူ",
    "小口切": "သေးသေးလှီး",
    "もやし": "ပဲပင်ပေါက်",
    "卵": "ကြက်ဥ",
    "サニーレタス": "လက်တပ်ရွက်",
    "仕込": "ကြိုတင်ပြင်",
    "カキフライ": "ကမာကြော်",
    "練り胡麻": "နှမ်းထောင်း",
    "酢豚": "ချဉ်ချိုဝက်သား",
    "タルタルソース": "တာတာဆော့စ်",
    "チリパウダー": "ငရုတ်မှုန့်",
    "明太子": "ငါးဥစပ်",
    "豆板醤": "ပဲငရုတ်ဆော့စ်",
    "豆乳": "ပဲနို့",
    "鍋": "ဟော့ပေါ့",
    "ドレッシング": "အသုပ်ဆော့စ်",
    "つゆ": "ဟင်းရည်",
    "ほぐし": "ဖဲ့ထားသော",
    "オイスターソース": "ခရုဆော့စ်",
    "激辛": "အလွန်စပ်",
    "四川": "စီချွမ်",
    "赤": "အနီ",
    "ポッカレモン": "လီမွန်ရည်",
    "オレンジ": "လိမ္မော်",
    "コーラ": "ကိုလာ",
    "ドライゼロ": "Dry Zero",
    "スーパードライ": "Super Dry",
    "瓶ビール": "ပုလင်းဘီယာ",
    "ガスボンベ": "ဓာတ်ငွေ့ဘူး",
    "混合油": "ဆီရော",
    "煮玉子": "ပြုတ်ဥနှပ်",
    "南蛮": "နန်ဘန်",
    "袋": "အိတ်",
    "タレビン": "ဆော့စ်ဘူးသေး",
    "卓上": "စားပွဲပေါ်"
  }
};

function renderAll() {
  applyStorePermissions();
  renderCurrentStore();
  renderProductList();
  renderSelectedProduct();
  renderStoreDashboard();
  renderMasterTable();
  renderMasterOptions();
  renderTabletop();
  renderSummary();
  renderMonthlyHistory();
  updateSaveStatus();
}

function renderCurrentStore() {
  if (!elements.currentStoreName) return;
  elements.currentStoreName.textContent = state.currentStoreName || state.currentStoreId || "店舗未設定";
}

function getInventoryRows() {
  return state.products.map((product) => {
    const quantity = getQuantity(product.id);
    const amount = quantity === null ? 0 : product.price * quantity;
    return { product, quantity, amount };
  });
}

function getCurrentStoreProgress() {
  const rows = getInventoryRows();
  const counted = rows.filter((row) => row.quantity !== null).length;
  const missing = rows.length - counted;
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const updatedValues = [
    state.savedAt,
    state.productsUpdatedAt,
    ...Object.values(state.countUpdatedAt || {})
  ].filter(Boolean);
  const latest = updatedValues
    .map((value) => Date.parse(value))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0];

  return {
    rate: rows.length ? Math.round((counted / rows.length) * 100) : 0,
    total,
    missing,
    updatedAt: latest ? new Date(latest).toISOString() : null
  };
}

function getStoreProgress(store) {
  if (state.storeProgress?.[store.id]) return state.storeProgress[store.id];
  if (store.id === state.currentStoreId) return getCurrentStoreProgress();
  return { rate: 0, total: 0, missing: state.products.length, updatedAt: null };
}

function renderStoreDashboard() {
  if (!elements.storeProgressBody || !elements.storeRoleList) return;
  const visibleStores = state.isAdmin ? stores : stores.filter((store) => store.id === state.currentStoreId);

  elements.storeProgressBody.innerHTML = visibleStores
    .map((store) => {
      const progress = getStoreProgress(store);
      return `
        <tr>
          <td>
            <strong>${escapeHtml(store.name)}</strong>
            <span>${escapeHtml(store.id)}</span>
          </td>
          <td>${progress.rate}%</td>
          <td>${currency.format(progress.total)}</td>
          <td>${progress.missing}</td>
          <td>${progress.updatedAt ? new Date(progress.updatedAt).toLocaleString("ja-JP") : "-"}</td>
        </tr>
      `;
    })
    .join("");

  elements.storeRoleList.innerHTML = visibleStores
    .map(
      (store) => `
        <article class="store-role-card">
          <div>
            <strong>${escapeHtml(store.name)}</strong>
            <span>${escapeHtml(store.role)}</span>
          </div>
          <dl>
            <div>
              <dt>可能</dt>
              <dd>${escapeHtml(store.can.join(" / "))}</dd>
            </div>
            <div>
              <dt>不可</dt>
              <dd>${store.cannot.length ? escapeHtml(store.cannot.join(" / ")) : "-"}</dd>
            </div>
          </dl>
        </article>
      `
    )
    .join("");
}

function downloadCsv(scope = "store", type = "summary") {
  const safeScope = scope === "all" ? "all" : "store";
  const safeType = ["tabletop", "monthly"].includes(type) ? type : "summary";
  window.location.href = `./api/export.csv?scope=${safeScope}&type=${safeType}&t=${Date.now()}`;
}

function triggerCsvDownload(scope = "store", type = "summary") {
  const safeScope = scope === "all" ? "all" : "store";
  const safeType = ["tabletop", "monthly"].includes(type) ? type : "summary";
  const link = document.createElement("a");
  link.href = `./api/export.csv?scope=${safeScope}&type=${safeType}&t=${Date.now()}`;
  link.target = "_blank";
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
}

function renderMasterOptions() {
  const categories = [...new Set(state.products.map((product) => product.category).filter(Boolean))].sort();
  const units = [...new Set(state.products.map((product) => product.unit).filter(Boolean))].sort();
  elements.categoryOptions.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
  elements.unitOptions.innerHTML = units
    .map((unit) => `<option value="${escapeHtml(unit)}"></option>`)
    .join("");
  renderPickerMenu(elements.categoryPickerMenu, categories, "category");
  renderPickerMenu(elements.unitPickerMenu, units, "unit");
}

function renderPickerMenu(menu, values, type) {
  menu.innerHTML = values
    .map((value) => `<button type="button" data-picker-type="${type}" data-picker-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`)
    .join("");
}

function togglePickerMenu(menu) {
  const willOpen = menu.hidden;
  closePickerMenus();
  menu.hidden = !willOpen;
}

function openPickerMenu(menu) {
  closePickerMenus();
  menu.hidden = false;
}

function closePickerMenus() {
  elements.categoryPickerMenu.hidden = true;
  elements.unitPickerMenu.hidden = true;
}

function selectPickerValue(type, value) {
  const input = type === "category" ? elements.masterCategory : elements.masterUnit;
  input.value = value;
  input.focus();
  closePickerMenus();
}

function renderProductList() {
  const keyword = normalizeSearchText(elements.productSearch.value);
  const products = orderProductsByPrediction(state.products.filter((product) => {
    if (!keyword) return true;
    return getSearchTargets(product).some((target) => target.includes(keyword));
  }), keyword);

  if (!products.length) {
    elements.productList.innerHTML = `<div class="empty-state">${escapeHtml(t("noProducts"))}</div>`;
    return;
  }

  elements.productList.innerHTML = products
    .map((product) => {
      const quantity = getQuantity(product.id);
      const selectedClass = product.id === selectedProductId ? " is-selected" : "";
      const statusClass = quantity === null ? " is-missing" : " is-entered";
      const entered = quantity !== null
        ? `<small class="entered-mark">${formatQuantity(quantity)} ${product.unit}</small>`
        : `<small>${escapeHtml(t("unentered"))}</small>`;
      return `
        <button class="product-card${selectedClass}${statusClass}" type="button" data-product-id="${product.id}">
          <span>
            ${renderProductName(product)}
            <span>${escapeHtml(renderProductMeta(product))}</span>
          </span>
          ${entered}
        </button>
      `;
    })
    .join("");
}

function orderProductsByPrediction(products, keyword) {
  if (keyword || !state.lastConfirmedProductId) return products;

  const transitions = state.routeTransitions[state.lastConfirmedProductId];
  if (!transitions) return products;

  const productIds = new Set(products.map((product) => product.id));
  const predictedIds = Object.entries(transitions)
    .filter(([productId]) => productIds.has(productId))
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([productId]) => productId);

  if (!predictedIds.length) return products;

  return [
    ...predictedIds.map((productId) => products.find((product) => product.id === productId)).filter(Boolean),
    ...products.filter((product) => !predictedIds.includes(product.id))
  ];
}

function renderSelectedProduct() {
  const product = getSelectedProduct();
  const hasProduct = Boolean(product);
  elements.quantityInput.disabled = !hasProduct;
  elements.addQuantityInput.disabled = !hasProduct;
  elements.modalSaveButton.disabled = !hasProduct;
  elements.saveSelectedButton.disabled = !hasProduct;

  if (!product) {
    elements.selectedName.textContent = "商品を選択してください";
    elements.selectedCategory.textContent = t("notSelected");
    elements.selectedUnit.textContent = "-";
    elements.selectedPrice.textContent = "-";
    elements.selectedAmount.textContent = "-";
    elements.quantityInput.value = "";
    elements.addQuantityInput.value = "";
    renderEntryModal();
    return;
  }

  const quantity = getQuantity(product.id);
  const amount = quantity === null ? 0 : product.price * quantity;
  elements.selectedName.innerHTML = renderProductName(product);
  elements.selectedCategory.textContent = getVisibleCategory(product) || product.unit;
  elements.selectedUnit.textContent = product.unit;
  elements.selectedPrice.textContent = currency.format(product.price);
  elements.selectedAmount.textContent = quantity === null ? "-" : currency.format(amount);
  elements.quantityInput.value = quantity === null ? "" : formatQuantity(quantity);
  elements.addQuantityInput.value = "";
  renderEntryModal();
}

function renderEntryModal() {
  const product = getSelectedProduct();
  if (!product) {
    elements.entryModalTitle.textContent = t("selectProduct");
    elements.modalCategory.textContent = t("notSelected");
    elements.modalUnit.textContent = "-";
    elements.modalPrice.textContent = "-";
    elements.modalAmount.textContent = "-";
    elements.modalQuantityInput.value = "";
    elements.modalAddQuantityInput.value = "";
    return;
  }

  const quantity = getQuantity(product.id);
  const amount = quantity === null ? 0 : product.price * quantity;
  elements.entryModalTitle.innerHTML = renderProductName(product);
  elements.modalCategory.textContent = getVisibleCategory(product) || product.unit;
  elements.modalUnit.textContent = product.unit;
  elements.modalPrice.textContent = currency.format(product.price);
  elements.modalAmount.textContent = quantity === null ? "-" : currency.format(amount);
  if (document.activeElement !== elements.modalQuantityInput) {
    elements.modalQuantityInput.value = quantity === null ? "" : formatQuantity(quantity);
  }
  if (document.activeElement !== elements.modalAddQuantityInput) {
    elements.modalAddQuantityInput.value = "";
  }
}

function renderMasterTable() {
  elements.masterTableBody.innerHTML = state.products
    .map(
      (product) => `
        <tr>
          <td>${renderProductName(product)}</td>
          <td>${escapeHtml(product.category)}</td>
          <td>${escapeHtml(product.unit)}</td>
          <td>${currency.format(product.price)}</td>
          <td>
            <div class="row-actions">
              <button type="button" data-edit-id="${product.id}">${escapeHtml(t("editProduct"))}</button>
              <button type="button" data-delete-id="${product.id}">${escapeHtml(t("deleteProduct"))}</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function getTabletopItems() {
  return state.products.filter((product) => product.category === "卓上" && product.name !== "フライオイル");
}

function getFryOilItem() {
  return state.products.find((product) => product.name === "フライオイル")
    ?? { id: "tabletop-fry-oil", name: "フライオイル", category: "フライヤー", unit: "円", price: 0 };
}

function getTabletopEntry(itemId) {
  return state.tabletop[itemId] ?? { last: "", purchase: "", current: "" };
}

function parseAmountInput(value) {
  const normalized = String(value ?? "").replace(/,/g, "").trim();
  if (!normalized) return 0;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

function calculateTabletopCost(entry) {
  return parseAmountInput(entry.last) + parseAmountInput(entry.purchase) - parseAmountInput(entry.current);
}

function renderTabletop() {
  if (!elements.tabletopTableBody) return;
  const items = getTabletopItems();
  let costTotal = 0;

  elements.tabletopTableBody.innerHTML = items
    .map((item) => {
      const entry = getTabletopEntry(item.id);
      const cost = calculateTabletopCost(entry);
      costTotal += cost;

      return renderTabletopRow(item, entry, cost);
    })
    .join("");

  const fryOilItem = getFryOilItem();
  const fryOilEntry = getTabletopEntry(fryOilItem.id);
  elements.fryOilTableBody.innerHTML = renderTabletopRow(fryOilItem, fryOilEntry, calculateTabletopCost(fryOilEntry));
  elements.tabletopTotalCost.textContent = currency.format(costTotal);
}

function renderTabletopRow(item, entry, cost) {
  return `
    <tr>
      <td>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="tabletop-category">${escapeHtml(item.category)}</span>
      </td>
      <td><input class="amount-input" type="number" min="0" step="1" inputmode="numeric" value="${escapeHtml(entry.last)}" data-tabletop-id="${item.id}" data-tabletop-field="last"></td>
      <td><input class="amount-input" type="number" min="0" step="1" inputmode="numeric" value="${escapeHtml(entry.purchase)}" data-tabletop-id="${item.id}" data-tabletop-field="purchase"></td>
      <td><input class="amount-input" type="number" min="0" step="1" inputmode="numeric" value="${escapeHtml(entry.current)}" data-tabletop-id="${item.id}" data-tabletop-field="current"></td>
      <td><strong>${currency.format(cost)}</strong></td>
    </tr>
  `;
}

function updateTabletopEntry(itemId, field, value) {
  state.tabletop[itemId] = {
    ...getTabletopEntry(itemId),
    [field]: value
  };
  state.tabletopUpdatedAt[`${itemId}.${field}`] = new Date().toISOString();
  markDirty();
  renderTabletop();
}

function getLatestInventoryArchive() {
  return [...(state.inventoryArchives || [])]
    .sort((left, right) => getTimestamp(right.closedAt) - getTimestamp(left.closedAt))[0] || null;
}

function getMonthlyArchives() {
  return [...(state.inventoryArchives || [])]
    .sort((left, right) => getTimestamp(right.closedAt) - getTimestamp(left.closedAt))
    .slice(0, 12);
}

function renderMonthlyHistory() {
  if (!elements.monthlyHistoryBody) return;
  const archives = getMonthlyArchives();
  if (!archives.length) {
    elements.monthlyHistoryBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-table-cell">${escapeHtml(t("monthlyNoHistory"))}</td>
      </tr>
    `;
    return;
  }

  elements.monthlyHistoryBody.innerHTML = archives
    .map((archive) => `
      <tr>
        <td>${escapeHtml(archive.month || "-")}</td>
        <td>${archive.closedAt ? new Date(archive.closedAt).toLocaleString("ja-JP") : "-"}</td>
        <td>${currency.format(archive.total || 0)}</td>
        <td>${formatter.format(archive.counted || 0)}</td>
        <td>${formatter.format(archive.missing || 0)}</td>
        <td>${formatter.format(archive.productCount || 0)}</td>
        <td>
          <button type="button" data-delete-archive-id="${escapeHtml(archive.id)}">${escapeHtml(t("monthlyDelete"))}</button>
        </td>
      </tr>
    `)
    .join("");
}

function renderSummary() {
  const rows = getInventoryRows();
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const counted = rows.filter((row) => row.quantity !== null).length;
  const missing = rows.filter((row) => row.quantity === null);
  const latestArchive = getLatestInventoryArchive();

  elements.totalAmount.textContent = currency.format(total);
  elements.countedItems.textContent = `${counted} / ${state.products.length}`;
  elements.missingItems.textContent = String(missing.length);
  if (elements.lastClosedTotal) {
    elements.lastClosedTotal.textContent = latestArchive ? currency.format(latestArchive.total || 0) : "-";
  }
  if (elements.lastClosedDate) {
    elements.lastClosedDate.textContent = latestArchive?.closedAt ? new Date(latestArchive.closedAt).toLocaleString("ja-JP") : "-";
  }

  elements.summaryTableBody.innerHTML = rows
    .map(
      ({ product, quantity, amount }) => `
        <tr class="${quantity === null ? "is-missing" : "is-entered"}">
          <td>${renderProductName(product)}</td>
          <td>${quantity === null ? escapeHtml(t("unentered")) : formatter.format(quantity)}</td>
          <td>${escapeHtml(product.unit)}</td>
          <td>${currency.format(product.price)}</td>
          <td>${quantity === null ? "-" : currency.format(amount)}</td>
        </tr>
      `
    )
    .join("");

  elements.missingList.innerHTML = missing.length
    ? missing
        .map(
          ({ product }) => `
            <div class="missing-item">
              <span>${renderProductName(product)}</span>
              <span>${escapeHtml(renderProductMeta(product))}</span>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">${escapeHtml(t("emptyMissing"))}</div>`;
}

async function closeMonthlyInventory() {
  const ok = confirm(t("monthlyCloseConfirm"));
  if (!ok) return;

  try {
    showToast(t("monthlyCloseCsvNotice"));
    triggerCsvDownload("store", "summary");
    await new Promise((resolve) => setTimeout(resolve, 700));
    const response = await fetch("./api/monthly-close", { method: "POST" });
    if (!response.ok) throw new Error(`Monthly close failed: ${response.status}`);
    const payload = await response.json();
    if (payload.state) replaceLocalState(payload.state);
    clearPendingSync();
    isDirty = false;
    showToast(t("monthlyCloseDone"));
  } catch {
    showToast(t("syncFailed"));
  }
}

async function deleteMonthlyArchive(archiveId) {
  const ok = confirm(t("monthlyDeleteConfirm"));
  if (!ok) return;

  try {
    const response = await fetch("./api/monthly-archive/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: archiveId })
    });
    if (!response.ok) throw new Error(`Delete archive failed: ${response.status}`);
    const payload = await response.json();
    if (payload.state) replaceLocalState(payload.state);
    clearPendingSync();
    isDirty = false;
    showToast(t("monthlyDeleted"));
  } catch {
    showToast(t("syncFailed"));
  }
}

function setQuantity(productId, quantity) {
  const updatedAt = new Date().toISOString();
  const parsedQuantity = parseQuantityInput(quantity);
  if (parsedQuantity === null) {
    delete state.counts[productId];
  } else {
    state.counts[productId] = parsedQuantity;
  }
  state.countUpdatedAt[productId] = updatedAt;
  markDirty();
  renderProductList();
  renderSelectedAmount();
  renderSummary();
  renderStoreDashboard();
}

function renderSelectedAmount() {
  const product = getSelectedProduct();
  if (!product) return;
  updateEntryAmountPreviews();
}

function updateEntryAmountPreviews() {
  const product = getSelectedProduct();
  if (!product) return;
  const panelQuantity = getQuantityAfterAddition(product, elements.quantityInput, elements.addQuantityInput);
  const modalQuantity = getQuantityAfterAddition(product, elements.modalQuantityInput, elements.modalAddQuantityInput);
  elements.selectedAmount.textContent = panelQuantity === null ? "-" : currency.format(product.price * panelQuantity);
  elements.modalAmount.textContent = modalQuantity === null ? "-" : currency.format(product.price * modalQuantity);
}

function supportsSpeechRecognition() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function startVoiceInput(options = {}) {
  const product = getSelectedProduct();
  if (!product || !supportsSpeechRecognition()) return;
  const quantityInput = options.quantityInput ?? elements.quantityInput;
  const voiceButton = options.voiceButton ?? elements.voiceButton;
  const voiceStatus = options.voiceStatus ?? elements.voiceStatus;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = speechLanguages[currentLanguage] ?? "ja-JP";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceButton.disabled = true;
  voiceStatus.textContent = t("voiceListening");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const quantity = parseSpokenQuantity(transcript);
    if (quantity === null) {
      voiceStatus.textContent = t("voiceParseFailed", { transcript });
      return;
    }

    quantityInput.value = formatQuantity(quantity);
    setQuantity(product.id, quantity);
    voiceStatus.textContent = t("voiceParsed", { transcript, quantity: formatQuantity(quantity) });
  };

  recognition.onerror = () => {
    voiceStatus.textContent = t("voiceFailed");
  };

  recognition.onend = () => {
    voiceButton.disabled = !getSelectedProduct() || !supportsSpeechRecognition();
  };

  recognition.start();
}

function parseSpokenQuantity(text) {
  const normalized = text
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/点/g, ".")
    .replace(/てん/g, ".")
    .replace(/,/g, "")
    .trim();

  const numeric = normalized.match(/\d+(?:\.\d+)?/);
  if (numeric) return Number(numeric[0]);

  const japaneseNumber = parseJapaneseNumber(normalized);
  return japaneseNumber;
}

function parseJapaneseNumber(text) {
  const compact = text
    .replace(/\s/g, "")
    .replace(/一/g, "いち")
    .replace(/二/g, "に")
    .replace(/三/g, "さん")
    .replace(/四/g, "よん")
    .replace(/五/g, "ご")
    .replace(/六/g, "ろく")
    .replace(/七/g, "なな")
    .replace(/八/g, "はち")
    .replace(/九/g, "きゅう")
    .replace(/十/g, "じゅう")
    .replace(/百/g, "ひゃく")
    .replace(/千/g, "せん");

  const decimalParts = compact.split(".");
  const integer = parseJapaneseInteger(decimalParts[0]);
  if (integer === null) return null;
  if (decimalParts.length === 1) return integer;

  const decimalDigits = parseJapaneseDecimalDigits(decimalParts[1]);
  if (!decimalDigits.length) return integer;
  return Number(`${integer}.${decimalDigits.join("")}`);
}

function parseJapaneseInteger(text) {
  const candidates = text.match(/(ぜろ|れい|いち|に|さん|よん|し|ご|ろく|なな|しち|はち|きゅう|く|じゅう|ひゃく|せん)+/g);
  if (!candidates) return null;

  const numberText = candidates.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
  if (!numberText) return null;

  let remaining = numberText;
  let total = 0;
  const units = [
    { word: "せん", value: 1000 },
    { word: "ひゃく", value: 100 },
    { word: "じゅう", value: 10 }
  ];

  for (const unit of units) {
    const index = remaining.indexOf(unit.word);
    if (index === -1) continue;
    const prefix = remaining.slice(0, index);
    const digit = prefix ? parseJapaneseDigit(prefix) : 1;
    if (digit === null) return null;
    total += digit * unit.value;
    remaining = remaining.slice(index + unit.word.length);
  }

  if (remaining) {
    const ones = parseJapaneseDigit(remaining);
    if (ones === null) return null;
    total += ones;
  }

  return total;
}

function parseJapaneseDigit(text) {
  const digitMap = {
    ぜろ: 0,
    れい: 0,
    いち: 1,
    に: 2,
    さん: 3,
    よん: 4,
    し: 4,
    ご: 5,
    ろく: 6,
    なな: 7,
    しち: 7,
    はち: 8,
    きゅう: 9,
    く: 9
  };

  return Object.prototype.hasOwnProperty.call(digitMap, text) ? digitMap[text] : null;
}

function parseJapaneseDecimalDigits(text) {
  const words = ["きゅう", "しち", "なな", "よん", "ぜろ", "れい", "いち", "さん", "ろく", "はち", "に", "し", "ご", "く"];
  const digits = [];
  let remaining = text;

  while (remaining) {
    const word = words.find((candidate) => remaining.startsWith(candidate));
    if (!word) break;
    digits.push(parseJapaneseDigit(word));
    remaining = remaining.slice(word.length);
  }

  return digits;
}

function recordProductSequence(productId) {
  const previousProductId = state.lastConfirmedProductId;
  if (previousProductId && previousProductId !== productId) {
    state.routeTransitions[previousProductId] = {
      ...(state.routeTransitions[previousProductId] || {}),
      [productId]: (state.routeTransitions[previousProductId]?.[productId] || 0) + 1
    };
  }
  state.lastConfirmedProductId = productId;
}

function saveSelectedProduct() {
  const product = getSelectedProduct();
  if (!product) return;
  const quantity = getQuantityAfterAddition(product, elements.quantityInput, elements.addQuantityInput);
  recordProductSequence(product.id);
  setQuantity(product.id, quantity);
  elements.quantityInput.value = quantity === null ? "" : formatQuantity(quantity);
  elements.addQuantityInput.value = "";
  persistState();
}

function saveSelectedProductFromModal() {
  const product = getSelectedProduct();
  if (!product) return;
  const quantity = getQuantityAfterAddition(product, elements.modalQuantityInput, elements.modalAddQuantityInput);
  recordProductSequence(product.id);
  setQuantity(product.id, quantity);
  elements.modalQuantityInput.value = quantity === null ? "" : formatQuantity(quantity);
  elements.modalAddQuantityInput.value = "";
  persistState();
  closeEntryModal();
  showToast(t("inputOk"));
}

function addMasterProduct(product) {
  const index = state.products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    state.products[index] = product;
  } else {
    state.products.push(product);
    selectedProductId = product.id;
  }

  state.productsUpdatedAt = new Date().toISOString();
  persistState({ draft: true, silent: true });
  renderAll();
  showToast(t("registeredOk"));
}

async function publishMasterToStores() {
  const ok = confirm(t("publishMasterConfirm"));
  if (!ok) return;

  try {
    const response = await fetch("./api/master/publish", { method: "POST" });
    if (!response.ok) throw new Error(`Publish failed: ${response.status}`);
    const payload = await response.json();
    if (payload.state) mergeRemoteState(payload.state);
    clearPendingSync();
    isDirty = false;
    showToast(t("publishMasterDone"));
  } catch {
    showToast(t("syncFailed"));
  }
}

function handleProductSubmit(event) {
  event.preventDefault();
  const id = elements.editingProductId.value || createLocalId("product");
  const priceText = elements.masterPrice.value.trim();
  const product = {
    id,
    name: elements.masterName.value.trim(),
    category: elements.masterCategory.value.trim(),
    unit: elements.masterUnit.value.trim(),
    price: Number(priceText)
  };

  if (!product.name || !product.category || !product.unit || !priceText || Number.isNaN(product.price)) {
    showToast("未入力の項目があります");
    return;
  }

  elements.productForm.reset();
  elements.editingProductId.value = "";
  addMasterProduct(product);
}

function editProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  elements.editingProductId.value = product.id;
  elements.masterName.value = product.name;
  elements.masterCategory.value = product.category;
  elements.masterUnit.value = product.unit;
  elements.masterPrice.value = product.price;
  elements.masterName.focus();
}

function deleteProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  const ok = confirm(t("deleteConfirm", { name: product.name }));
  if (!ok) return;

  state.products = state.products.filter((item) => item.id !== productId);
  delete state.counts[productId];
  delete state.countUpdatedAt[productId];
  delete state.routeTransitions[productId];
  Object.values(state.routeTransitions).forEach((transitions) => {
    delete transitions[productId];
  });
  if (state.lastConfirmedProductId === productId) {
    state.lastConfirmedProductId = null;
  }
  state.productsUpdatedAt = new Date().toISOString();
  if (selectedProductId === productId) {
    selectedProductId = state.products[0]?.id ?? null;
  }
  markDirty(t("productDeleted"));
  renderAll();
}

function switchScreen(screen) {
  elements.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.screen === screen));
  elements.screens.forEach((section) => section.classList.toggle("is-active", section.id === `screen-${screen}`));
}

function applyStorePermissions() {
  if (elements.exportAllCsvButton) {
    elements.exportAllCsvButton.hidden = !state.isAdmin;
  }
  if (elements.publishMasterButton) {
    elements.publishMasterButton.hidden = !state.isAdmin || state.currentStoreId !== "asaka";
  }
}

function openQrModal() {
  elements.qrModal.hidden = false;
  elements.closeQrButton.focus();
}

function closeQrModal() {
  elements.qrModal.hidden = true;
  elements.openQrButton.focus();
}

async function copyQrUrl() {
  const url = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "staff.html")}?v=${APP_VERSION}`;

  try {
    await navigator.clipboard.writeText(url);
    showToast("URLをコピーしました");
  } catch {
    const input = document.createElement("input");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast("URLをコピーしました");
  }
}

function shouldOpenEntryModal() {
  return window.matchMedia("(max-width: 860px)").matches;
}

function openEntryModal() {
  renderEntryModal();
  elements.entryModal.hidden = false;
  setTimeout(() => {
    elements.modalQuantityInput.focus();
    elements.modalQuantityInput.select();
  }, 0);
}

function closeEntryModal() {
  elements.entryModal.hidden = true;
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toastMessage.textContent = message;
  elements.toastMessage.hidden = false;
  toastTimer = setTimeout(() => {
    elements.toastMessage.hidden = true;
  }, 1600);
}

function openCalculator() {
  elements.calculatorModal.hidden = false;
  updateCalculatorDisplay();
}

function closeCalculator() {
  elements.calculatorModal.hidden = true;
}

function updateCalculatorDisplay(value = calculatorExpression) {
  elements.calculatorDisplay.textContent = value || "0";
}

function appendCalculatorValue(value) {
  const last = calculatorExpression.slice(-1);
  const isOperator = ["+", "-", "*", "/"].includes(value);
  if (isOperator && (!calculatorExpression || ["+", "-", "*", "/"].includes(last))) {
    calculatorExpression = value === "-" && !calculatorExpression ? "-" : calculatorExpression.slice(0, -1) + value;
  } else if (value === "." && calculatorExpression.split(/[+\-*/]/).pop().includes(".")) {
    return;
  } else {
    calculatorExpression += value;
  }
  updateCalculatorDisplay();
}

function calculateExpression() {
  const expression = calculatorExpression.replace(/×/g, "*").replace(/÷/g, "/");
  if (!/^[0-9+\-*/. ]+$/.test(expression) || /[+\-*/.]$/.test(expression)) {
    updateCalculatorDisplay("エラー");
    return;
  }
  const result = Function(`"use strict"; return (${expression})`)();
  calculatorExpression = Number.isFinite(result) ? String(Math.round(result * 100) / 100) : "";
  updateCalculatorDisplay(calculatorExpression || "エラー");
}

function handleCalculatorInput(event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.calcValue) {
    appendCalculatorValue(button.dataset.calcValue);
    return;
  }

  if (button.dataset.calcAction === "clear") {
    calculatorExpression = "";
    updateCalculatorDisplay();
  }
  if (button.dataset.calcAction === "backspace") {
    calculatorExpression = calculatorExpression.slice(0, -1);
    updateCalculatorDisplay();
  }
  if (button.dataset.calcAction === "equals") {
    calculateExpression();
  }
}

function getInitialScreen() {
  const screen = new URLSearchParams(window.location.search).get("screen");
  if (["count", "master", "tabletop", "summary", "monthly"].includes(screen)) return screen;

  const page = window.location.pathname.split("/").pop();
  if (page === "manager.html") return "summary";
  if (page === "admin.html") return "master";
  return "count";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchScreen(tab.dataset.screen));
});

elements.languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentLanguage = button.dataset.lang;
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
    applyLanguage();
    renderAll();
    elements.saveStatus.textContent = t("languageChanged", { language: languageNames[currentLanguage] });
  });
});

elements.productSearch.addEventListener("input", renderProductList);

elements.productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  selectedProductId = button.dataset.productId;
  renderProductList();
  renderSelectedProduct();
  if (shouldOpenEntryModal()) {
    openEntryModal();
  }
});

elements.quantityInput.addEventListener("input", () => {
  const product = getSelectedProduct();
  if (!product) return;
  setQuantity(product.id, elements.quantityInput.value);
});

elements.addQuantityInput.addEventListener("input", updateEntryAmountPreviews);

elements.modalQuantityInput.addEventListener("input", () => {
  const product = getSelectedProduct();
  if (!product) return;
  setQuantity(product.id, elements.modalQuantityInput.value);
});

elements.modalAddQuantityInput.addEventListener("input", updateEntryAmountPreviews);

elements.openQrButton.addEventListener("click", openQrModal);
elements.copyQrUrlButton?.addEventListener("click", copyQrUrl);
elements.closeQrButton.addEventListener("click", closeQrModal);
elements.closeQrBackdrop.addEventListener("click", closeQrModal);
elements.closeEntryButton.addEventListener("click", closeEntryModal);
elements.closeEntryBackdrop.addEventListener("click", closeEntryModal);
elements.openCalculatorButton.addEventListener("click", openCalculator);
elements.closeCalculatorButton.addEventListener("click", closeCalculator);
elements.closeCalculatorBackdrop.addEventListener("click", closeCalculator);
elements.calculatorGrid.addEventListener("click", handleCalculatorInput);
elements.exportStoreCsvButton?.addEventListener("click", () => downloadCsv("store", "summary"));
elements.exportAllCsvButton?.addEventListener("click", () => downloadCsv("all", "summary"));
elements.publishMasterButton?.addEventListener("click", publishMasterToStores);
elements.tabletopCsvButton?.addEventListener("click", () => downloadCsv("store", "tabletop"));
elements.summaryCsvButton?.addEventListener("click", () => downloadCsv("store", "summary"));
elements.monthlyCloseButton?.addEventListener("click", closeMonthlyInventory);
elements.monthlyHistoryCsvButton?.addEventListener("click", () => downloadCsv("store", "monthly"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.qrModal.hidden) {
    closeQrModal();
  }
  if (event.key === "Escape" && !elements.entryModal.hidden) {
    closeEntryModal();
  }
  if (event.key === "Escape" && !elements.calculatorModal.hidden) {
    closeCalculator();
  }
  if (event.key === "Escape") {
    closePickerMenus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".input-picker") && !event.target.closest(".picker-menu")) {
    closePickerMenus();
  }
});
elements.saveSelectedButton.addEventListener("click", saveSelectedProduct);
elements.modalSaveButton.addEventListener("click", saveSelectedProductFromModal);
elements.draftSaveButton.addEventListener("click", saveDraft);
elements.saveAllButton.addEventListener("click", finalizeSave);
elements.productForm.addEventListener("submit", handleProductSubmit);
elements.masterCategory.addEventListener("focus", () => openPickerMenu(elements.categoryPickerMenu));
elements.masterCategory.addEventListener("input", () => openPickerMenu(elements.categoryPickerMenu));
elements.masterUnit.addEventListener("focus", () => openPickerMenu(elements.unitPickerMenu));
elements.masterUnit.addEventListener("input", () => openPickerMenu(elements.unitPickerMenu));
elements.categoryPickerButton.addEventListener("click", () => togglePickerMenu(elements.categoryPickerMenu));
elements.unitPickerButton.addEventListener("click", () => togglePickerMenu(elements.unitPickerMenu));
elements.categoryPickerMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-picker-value]");
  if (!button) return;
  selectPickerValue(button.dataset.pickerType, button.dataset.pickerValue);
});
elements.unitPickerMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-picker-value]");
  if (!button) return;
  selectPickerValue(button.dataset.pickerType, button.dataset.pickerValue);
});

elements.cancelEditButton.addEventListener("click", () => {
  elements.productForm.reset();
  elements.editingProductId.value = "";
});

elements.masterTableBody.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-id]");
  const deleteButton = event.target.closest("[data-delete-id]");
  if (editButton) editProduct(editButton.dataset.editId);
  if (deleteButton) deleteProduct(deleteButton.dataset.deleteId);
});

elements.tabletopTableBody.addEventListener("change", (event) => {
  const input = event.target.closest("[data-tabletop-id]");
  if (!input) return;
  updateTabletopEntry(input.dataset.tabletopId, input.dataset.tabletopField, input.value);
});

elements.fryOilTableBody.addEventListener("change", (event) => {
  const input = event.target.closest("[data-tabletop-id]");
  if (!input) return;
  updateTabletopEntry(input.dataset.tabletopId, input.dataset.tabletopField, input.value);
});

elements.monthlyHistoryBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-archive-id]");
  if (!button) return;
  deleteMonthlyArchive(button.dataset.deleteArchiveId);
});

applyLanguage();
registerOfflineSupport();
renderAll();
switchScreen(getInitialScreen());
syncWithServer({ pullOnly: true, silent: true });
