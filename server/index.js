const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'リクエスト数が上限に達しました。しばらく待ってから再試行してください。'
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB接続
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance_management';
    await mongoose.connect(mongoURI);
    console.log('MongoDB に接続しました');
  } catch (error) {
    console.error('MongoDB 接続エラー:', error);
    process.exit(1);
  }
};

connectDB();

// ルート
app.get('/', (req, res) => {
  res.json({
    message: '在籍管理システム API サーバー',
    version: '1.0.0',
    status: 'running'
  });
});

// 社員関連のAPI
app.use('/api/employees', require('./routes/employees'));

// 在籍状況関連のAPI
app.use('/api/attendance', require('./routes/attendance'));

// 統計情報API
app.use('/api/stats', require('./routes/stats'));

// 404 ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'APIエンドポイントが見つかりません'
  });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'サーバーエラーが発生しました',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
  console.log(`API URL: http://localhost:${PORT}`);
});