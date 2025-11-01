'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, LogIn, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Header({ onMenuClick, isMobileMenuOpen = false }: HeaderProps) {
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const unreadNotifications = 3;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 検索機能を実装
      console.log('検索:', searchQuery);
    }
  };

  const handleMobileMenuToggle = () => {
    if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-gray-900 border-b border-gray-800 z-30">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* 左側: ハンバーガーボタン（モバイル） + 検索バー */}
          <div className="flex items-center gap-3 flex-1">
            {/* ハンバーガーボタン - モバイルのみ表示 */}
            {isLoggedIn && (
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="メニューを開く"
              >
                <Menu size={24} />
              </button>
            )}

            {/* 検索バー */}
            <div className="flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="攻略記事、作品、ユーザーを検索..."
                  className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm sm:text-base"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </form>
            </div>
          </div>

          {/* 右側: 通知 */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4 sm:gap-6">
              {/* 通知アイコン */}
              <Link
                href="/profile?tab=notifications"
                className="relative hover:text-purple-400 transition-colors"
              >
                <Bell size={24} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogIn size={20} />
              <span className="hidden sm:inline">ログイン</span>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
