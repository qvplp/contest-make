'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Trophy,
  Lightbulb,
  Settings,
  HelpCircle,
  X,
  PlusCircle,
  Gavel,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WorkSubmitModal from '@/components/works/WorkSubmitModal';

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobileMenuOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isJudge } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ユーザー情報を整形（avatarがない場合はデフォルト画像を使用）
  const userData = user ? {
    name: user.name,
    username: user.email?.split('@')[0] || 'user',
    avatar: user.avatar || '/images/avatars/user1.jpg',
  } : null;

  const navigationItems = [
    { href: '/', icon: Home, label: 'ホーム' },
    { href: '/contests', icon: Trophy, label: 'コンテスト' },
    { href: '/guides', icon: Lightbulb, label: '攻略・使い方' },
  ];

  const bottomItems = [
    { href: '/settings', icon: Settings, label: '設定' },
    { href: '/help', icon: HelpCircle, label: 'ヘルプ' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // メニューアイテムをクリックしたらモバイルメニューを閉じる
  const handleMenuItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!userData) {
    return null; // ログインしていない場合はサイドバーを非表示
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      {/* モバイル用閉じるボタン */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        aria-label="メニューを閉じる"
      >
        <X size={24} />
      </button>

      {/* Logo */}
      <div className="p-6">
        <Link
          href="/"
          onClick={handleMenuItemClick}
          className="flex items-center gap-2 text-xl font-bold"
        >
          <span className="text-2xl">🦇</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AnimeHub
          </span>
        </Link>
      </div>

      {/* User Profile Section - クリックでマイページへ */}
      <Link href="/profile" onClick={handleMenuItemClick}>
        <div className="mx-4 mb-4 p-4 rounded-lg border border-gray-800 hover:border-purple-600 hover:bg-gray-800/50 transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 group-hover:border-purple-400 transition-colors flex-shrink-0">
              <Image
                src={userData.avatar}
                alt={userData.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                {userData.name}
              </p>
              <p className="text-sm text-gray-400 truncate">
                @{userData.username}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="mx-4 mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-semibold transition"
        >
          <PlusCircle size={20} />
          作品を投稿
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
          {/* 審査員向けメニュー */}
          {isJudge && (
            <Link
              href="/judge/contests"
              onClick={handleMenuItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/judge')
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Gavel size={20} />
              <span className="font-medium">コンテスト審査</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuItemClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => {
            handleMenuItemClick();
            logout();
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-400 mt-2"
        >
          <span className="text-sm font-medium">ログアウト</span>
        </button>
      </div>
      <WorkSubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}

