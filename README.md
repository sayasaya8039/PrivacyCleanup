# プライバシー一発クリーン

ワンクリックでクッキー・キャッシュ・履歴を削除するChrome拡張機能。
**パスワードは守る設定付き**で、トラッカー嫌いな人に最適！

## 機能

- **ワンクリッククリーンアップ** - ボタン一つでプライバシーデータを即座に削除
- **パスワード保護** - 保存済みパスワードは削除対象から除外（デフォルトON）
- **カスタマイズ可能** - 削除対象を細かく選択可能
  - クッキー
  - キャッシュ
  - 閲覧履歴
  - ダウンロード履歴
  - フォームデータ
  - ローカルストレージ
- **設定の保存** - 選択した設定は自動で保存

## インストール方法

### 開発者モードでインストール

1. このリポジトリをクローンまたはダウンロード
2. `npm install` で依存関係をインストール
3. `npm run build` でビルド
4. Chromeで `chrome://extensions/` を開く
5. 右上の「デベロッパーモード」をONにする
6. 「パッケージ化されていない拡張機能を読み込む」をクリック
7. `PrivacyCleanup` フォルダを選択

### ZIPファイルからインストール

1. `PrivacyCleanup.zip` をダウンロード
2. 解凍して `PrivacyCleanup` フォルダを取得
3. Chromeで `chrome://extensions/` を開く
4. 右上の「デベロッパーモード」をONにする
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 解凍した `PrivacyCleanup` フォルダを選択

## 使い方

1. ツールバーの拡張機能アイコンをクリック
2. 削除したい項目のトグルをON/OFFで選択
3. 「一発クリーン！」ボタンをクリック
4. 完了メッセージが表示されたら成功！

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **Chrome API**: browsingData, storage

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# リントチェック
npm run lint

# 本番ビルド
npm run build
```

## フォルダ構成

```
PrivacyCleanup/
├── public/
│   ├── manifest.json    # Chrome拡張機能の設定
│   └── icons/           # アイコン画像
├── src/
│   ├── popup/           # ポップアップUI
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── background/      # バックグラウンドスクリプト
│   │   └── index.ts
│   └── types/           # 型定義
│       └── index.ts
├── scripts/
│   └── create_icons.py  # アイコン生成スクリプト
└── PrivacyCleanup/      # ビルド出力
```

## ライセンス

MIT License

## バージョン

v1.0.0
