# 🛒 Amazon風オンラインショッピングサイト

プログラミング初心者向けのEコマースサイト構築プロジェクトです。

## 🎯 このプロジェクトで学べること

- **React.js**: モダンなフロントエンド開発
- **Node.js/Express**: サーバーサイド開発
- **MongoDB**: データベース操作
- **認証システム**: ユーザー登録・ログイン
- **決済システム**: Stripe連携

## 📂 プロジェクト構成

```
amazon-clone/
├── client/          # フロントエンド（React.js）
│   ├── src/
│   │   ├── components/    # 再利用可能なコンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── context/       # 状態管理
│   │   └── styles/        # スタイル
│   └── public/
├── server/          # バックエンド（Node.js + Express）
│   ├── models/           # データベースモデル
│   ├── routes/           # APIルート
│   ├── middleware/       # ミドルウェア
│   └── utils/           # ユーティリティ関数
└── README.md        # このファイル
```

## 🚀 開発手順

### Phase 1: 基本セットアップ
1. プロジェクトの初期化
2. フロントエンドの基本構造作成
3. 基本的なページとコンポーネント作成

### Phase 2: 商品表示機能
1. 商品一覧ページ
2. 商品詳細ページ
3. 検索機能

### Phase 3: ユーザー機能
1. ユーザー登録・ログイン
2. プロフィール管理

### Phase 4: ショッピング機能
1. ショッピングカート
2. 注文機能
3. 注文履歴

### Phase 5: 管理者機能
1. 商品管理
2. 注文管理

## 🛠 セットアップ方法

### 1. 依存関係のインストール
```bash
# ルートディレクトリで実行
npm install

# クライアント側の依存関係をインストール
npm run install-client

# サーバー側の依存関係をインストール
npm run install-server
```

### 2. 環境変数の設定
```bash
# server/.env ファイルを作成して以下を設定
MONGODB_URI=mongodb://localhost:27017/amazon-clone
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 3. 開発サーバーの起動
```bash
# フロントエンドとバックエンドを同時に起動
npm run dev
```

## 📖 各フェーズの詳細説明

各開発フェーズで何を作るのか、どんな技術を使うのかを詳しく説明していきます。

### 🎨 使用するデザインシステム
- **カラーパレット**: Amazon風の青とオレンジ
- **レスポンシブデザイン**: スマホ・タブレット・PC対応
- **アニメーション**: スムーズなユーザー体験

### 🔧 技術スタック詳細
- **React.js**: ユーザーインターフェース構築
- **React Router**: ページ遷移管理
- **Context API**: 状態管理
- **Axios**: API通信
- **Material-UI**: UIコンポーネント
- **Express.js**: RESTful API
- **MongoDB**: NoSQLデータベース
- **JWT**: 認証トークン
- **Stripe**: 決済処理

## 📝 学習リソース

プロジェクトを進める上で役立つリンク：
- [React公式ドキュメント](https://ja.react.dev/)
- [Node.js公式ドキュメント](https://nodejs.org/ja/)
- [MongoDB公式チュートリアル](https://www.mongodb.com/docs/)

---

**注意**: このプロジェクトは学習目的で作成されています。実際の商用利用には追加のセキュリティ対策が必要です。