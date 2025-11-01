'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, LogIn, Menu, X, Home, Trophy, Lightbulb, Image as ImageIcon, PenTool, User, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { isLoggedIn, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadNotifications = 3;

  // モックデータ: クレジット情報（実際の実装ではAPIから取得）
  const credits = 92;

  // メニュー項目（サイドバーと同じ）
  const menuItems = [
    { icon: Home, label: 'ホーム', href: '/' },
    { icon: Trophy, label: 'コンテスト', href: '/contests' },
    { icon: Lightbulb, label: '攻略・使い方', href: '/guides' },
    { icon: ImageIcon, label: 'ギャラリー', href: '/gallery' },
    { icon: PenTool, label: '作成', href: '/create' },
  ];

  const bottomMenuItems = [
    { icon: Settings, label: '設定', href: '/settings' },
    { icon: HelpCircle, label: 'ヘルプ', href: '/help' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 検索機能を実装
      console.log('検索:', searchQuery);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // 既存のonMenuClickも呼び出す（サイドバーとの連携）
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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

      {/* モバイルメニュー（サイドバーと同じ内容） */}
      {isLoggedIn && isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                >
                  <Icon size={20} />
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* 区切り線 */}
            <div className="my-2 mx-6 border-t border-gray-800" />

            {/* ユーザー情報（モバイル） */}
            {user && (
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
              >
                <User size={20} />
                <span className="text-base font-medium">マイページ</span>
              </Link>
            )}

            {/* クレジット表示（モバイル） */}
            {user && (
              <div className="mx-6 my-3 p-4 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg">
                <div className="text-xs text-purple-100 mb-1">
                  クレジット残高
                </div>
                <div className="text-3xl font-bold text-white">
                  {credits}
                </div>
              </div>
            )}

            {/* 区切り線 */}
            <div className="my-2 mx-6 border-t border-gray-800" />

            {/* ボトムメニュー */}
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                >
                  <Icon size={20} />
                  <span className="text-base font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
