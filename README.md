# 棚卸カウント表

## Pilot test v1

保存日: 2026-05-31

## 公開URL

- staff: https://revealed-minimal-costa-vic.trycloudflare.com/staff.html?v=20260531-store-switch-isolation
- manager: https://revealed-minimal-costa-vic.trycloudflare.com/manager.html?v=20260531-store-switch-isolation
- admin: https://revealed-minimal-costa-vic.trycloudflare.com/admin.html?v=20260531-store-switch-isolation

## ローカル確認URL

- staff: http://192.168.3.2:4194/staff.html?v=20260531-store-switch-isolation
- manager: http://192.168.3.2:4194/manager.html?v=20260531-store-switch-isolation
- admin: http://192.168.3.2:4194/admin.html?v=20260531-store-switch-isolation

## ログイン情報

| 店舗 | ID | PASS | 権限 |
| --- | --- | --- | --- |
| 朝霞東口店 | asaka | 1122 | 管理者 |
| 熊谷南口店 | kumagaya | 1122 | 自店舗のみ |
| 浦和道場店 | urawa | 1122 | 自店舗のみ |

## 備考

- 検索エンジン非表示設定あり
- staff / manager / admin は同じ公開URL配下で利用
- 店舗データは asaka / kumagaya / urawa で分離

## Render デプロイ設定

- start command: `npm start`
- server: `server.js`
- port: `process.env.PORT` 対応済み
- persistent data: `DATA_DIR=/var/data`
- Blueprint: `render.yaml`

## Render 手動デプロイ手順

1. GitHubにこのプロジェクトをpushする
2. Renderで New + > Blueprint を選ぶ
3. GitHubリポジトリを接続する
4. `render.yaml` を選択して作成する
5. 初回公開後、以下を確認する

- `/staff.html`
- `/manager.html`
- `/admin.html`
- `/api/state`
- `/api/export.csv?scope=store&type=summary`

## Render 環境変数

| key | value |
| --- | --- |
| NODE_ENV | production |
| HOST | 0.0.0.0 |
| DATA_DIR | /var/data |

## 永続保存

Renderでは `inventory_state.json` を `/var/data` に保存します。
`render.yaml` で `inventory-data` ディスクを `/var/data` にマウントします。
