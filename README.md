# 在籍管理システム

## 概要

社内の在籍状況をリアルタイムで管理・表示するWebアプリケーションです。カレンダー形式で社員の在席状況を直感的に確認でき、部署別フィルタリング機能も搭載しています。

## 機能

### 主要機能
- **カレンダー表示**: 社員の在籍状況をカレンダー形式で表示
- **在籍ステータス管理**: 在席、不在、会議中、リモート、休暇の5種類のステータス
- **部署別フィルタリング**: 特定の部署の社員のみを表示
- **リアルタイム更新**: 在籍状況の即座の反映
- **統計情報**: 日別、週別、月別の在籍統計

### 在籍ステータス
- 🟢 **在席**: オフィスにいる状態
- 🔴 **不在**: オフィスにいない状態
- 🔵 **会議中**: 会議に参加中
- 🟡 **リモート**: リモートワーク中
- 🟣 **休暇**: 有給休暇・休日

## 技術スタック

### フロントエンド
- **React 19** + **TypeScript**
- **Tailwind CSS**: スタイリング
- **React Big Calendar**: カレンダー表示
- **Heroicons**: アイコン
- **date-fns**: 日付操作

### バックエンド
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**: データベース
- **date-fns**: 日付操作
- **express-validator**: バリデーション

## インストール・セットアップ

### 前提条件
- Node.js (v16以上)
- MongoDB (v4.4以上)
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd attendance-management-app
```

### 2. 依存関係のインストール
```bash
npm run install-all
```

### 3. 環境変数の設定
サーバーディレクトリに `.env` ファイルを作成：

```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/attendance_management
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 4. MongoDBの起動
```bash
mongod
```

### 5. アプリケーションの起動
```bash
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:5000

## API エンドポイント

### 社員管理
- `GET /api/employees` - 全社員取得
- `POST /api/employees` - 社員登録
- `PUT /api/employees/:id` - 社員情報更新
- `DELETE /api/employees/:id` - 社員削除（論理削除）
- `GET /api/employees/departments/list` - 部署一覧取得

### 在籍状況管理
- `GET /api/attendance` - 在籍状況取得
- `POST /api/attendance` - 在籍状況登録・更新
- `PUT /api/attendance/:id` - 在籍状況更新
- `DELETE /api/attendance/:id` - 在籍状況削除
- `GET /api/attendance/date/:date` - 特定日の在籍状況取得
- `POST /api/attendance/bulk` - 一括登録・更新

### 統計情報
- `GET /api/stats/today` - 今日の統計
- `GET /api/stats/date/:date` - 特定日の統計
- `GET /api/stats/weekly` - 週間統計
- `GET /api/stats/monthly` - 月間統計
- `GET /api/stats/departments` - 部署別統計

## データモデル

### Employee（社員）
```javascript
{
  name: String,          // 社員名
  department: String,    // 部署
  position: String,      // 役職
  email: String,         // メールアドレス
  avatar: String,        // アバター画像URL
  startDate: Date,       // 入社日
  isActive: Boolean      // アクティブ状態
}
```

### AttendanceStatus（在籍状況）
```javascript
{
  employeeId: ObjectId,  // 社員ID
  date: Date,           // 日付
  status: String,       // ステータス (present/absent/meeting/remote/vacation)
  startTime: String,    // 開始時間 (HH:MM)
  endTime: String,      // 終了時間 (HH:MM)
  note: String,         // 備考
  createdBy: String,    // 作成者
  updatedBy: String     // 更新者
}
```

## 使用方法

### 1. 社員の登録
1. 管理者がシステムに社員情報を登録
2. 部署、役職、メールアドレスなどの基本情報を入力

### 2. 在籍状況の更新
1. カレンダーから対象日を選択
2. 社員を選択してステータスを設定
3. 必要に応じて開始・終了時間や備考を入力

### 3. 在籍状況の確認
1. カレンダー表示で一覧確認
2. 部署フィルターで特定部署のみ表示
3. ステータスフィルターで特定状況のみ表示

## 開発

### ディレクトリ構成
```
attendance-management-app/
├── client/                 # React フロントエンド
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── types.ts        # TypeScript型定義
│   │   └── ...
│   └── package.json
├── server/                 # Express バックエンド
│   ├── models/             # Mongooseモデル
│   ├── routes/             # APIルート
│   ├── index.js            # サーバーエントリーポイント
│   └── package.json
└── package.json            # ルートパッケージ
```

### 開発用コマンド
```bash
npm run dev         # フロントエンド・バックエンド同時起動
npm run client      # フロントエンドのみ起動
npm run server      # バックエンドのみ起動
npm run build       # プロダクションビルド
```

## ライセンス

MIT License

## サポート

質問や問題がある場合は、GitHubのIssuesページでお知らせください。

---

**🏢 効率的な在籍管理で、よりスマートなオフィス運営を実現しましょう！**