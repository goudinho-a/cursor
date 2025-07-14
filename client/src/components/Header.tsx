import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('検索ワード:', searchTerm);
    // 検索機能は後で実装
  };

  return (
    <header className="header">
      {/* トップナビゲーション */}
      <div className="header__nav">
        {/* ロゴ */}
        <div className="header__logo">
          <h1>AmazonClone</h1>
        </div>

        {/* 配送先 */}
        <div className="header__option">
          <span className="header__optionLineOne">配送先</span>
          <span className="header__optionLineTwo">日本</span>
        </div>

        {/* 検索バー */}
        <div className="header__search">
          <form onSubmit={handleSearch}>
            <input 
              className="header__searchInput" 
              type="text" 
              placeholder="商品を検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="header__searchIcon">
              🔍
            </button>
          </form>
        </div>

        {/* 右側のオプション */}
        <div className="header__nav__right">
          {/* 言語切替 */}
          <div className="header__option">
            <span className="header__optionLineOne">言語</span>
            <span className="header__optionLineTwo">日本語</span>
          </div>

          {/* サインイン */}
          <div className="header__option">
            <span className="header__optionLineOne">こんにちは、ゲスト</span>
            <span className="header__optionLineTwo">アカウント＆リスト</span>
          </div>

          {/* 注文履歴 */}
          <div className="header__option">
            <span className="header__optionLineOne">返品と</span>
            <span className="header__optionLineTwo">注文履歴</span>
          </div>

          {/* カート */}
          <div className="header__optionBasket">
            <span className="header__basketCount">0</span>
            <span className="header__basketIcon">🛒</span>
          </div>
        </div>
      </div>

      {/* サブナビゲーション */}
      <div className="header__bottom">
        <div className="header__bottom__left">
          <span>📱 すべて</span>
          <span>タイムセール</span>
          <span>Prime Video</span>
          <span>Amazon Music</span>
          <span>ギフト券</span>
          <span>新着商品</span>
          <span>本</span>
          <span>家電</span>
          <span>ファッション</span>
        </div>
      </div>
    </header>
  );
};

export default Header;