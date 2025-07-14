import React from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="app">
      {/* ヘッダー */}
      <Header />
      
      {/* メインコンテンツ */}
      <main className="app__main">
        <div className="app__container">
          <h2>Amazon風ショッピングサイトへようこそ！</h2>
          <p>現在開発中です。素晴らしいショッピング体験をお楽しみください。</p>
          
          {/* 今後ここに商品一覧やバナーを追加 */}
          <div className="app__banner">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop" 
              alt="ショッピングバナー"
              className="app__bannerImage"
            />
          </div>
          
          <div className="app__message">
            <h3>🛠️ 開発予定機能</h3>
            <ul>
              <li>✅ ヘッダーナビゲーション</li>
              <li>🔄 商品一覧表示</li>
              <li>🔄 商品詳細ページ</li>
              <li>🔄 ショッピングカート</li>
              <li>🔄 ユーザー認証</li>
              <li>🔄 決済機能</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
