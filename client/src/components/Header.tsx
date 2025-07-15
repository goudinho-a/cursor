import React from 'react';
import { UsersIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ・タイトル */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">在籍管理システム</h1>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              <span>カレンダー</span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              社員管理
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              レポート
            </a>
          </nav>

          {/* ユーザーメニュー */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <span className="sr-only">設定</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">管理</span>
              </div>
              <span className="text-gray-700 text-sm font-medium">管理者</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;