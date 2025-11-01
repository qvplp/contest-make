'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Trophy,
  Lightbulb,
  Image as ImageIcon,
  PenTool,
  Settings,
  HelpCircle,
  Coins,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // モックデータ: クレジット情報（実際の実装ではAPIから取得）
  const credits = 92;

  // ユーザー情報を整形（avatarがない場合はデフォルト画像を使用）
  const userData = user ? {
    name: user.name,
    username: user.email?.split('@')[0] || 'user',
    avatar: user.avatar || '/images/avatars/user1.jpg',
    credits: credits,
  } : null;

  const navigationItems = [
    { href: '/', icon: Home, label: 'ホーム' },
    { href: '/contests', icon: Trophy, label: 'コンテスト' },
    { href: '/guides', icon: Lightbulb, label: '攻略・使い方' },
    { href: '/gallery', icon: ImageIcon, label: 'ギャラリー' },
    { href: '/create', icon: PenTool, label: '作成' },
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

  if (!userData) {
    return null; // ログインしていない場合はサイドバーを非表示
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🦇</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AnimeHub
          </span>
        </Link>
      </div>

      {/* User Profile Section - クリックでマイページへ */}
      <Link href="/profile">
        <div className="mx-4 mb-4 p-4 rounded-lg border border-gray-800 hover:border-purple-600 hover:bg-gray-800/50 transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-600 group-hover:border-purple-400 transition-colors">
              <Image
                src={userData.avatar}
                alt={userData.name}
                fill
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

      {/* Credit Balance Card */}
      <div className="mx-4 mb-4 p-4 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Coins size={16} className="text-yellow-300" />
          <span className="text-sm text-purple-100">クレジット残高</span>
        </div>
        <div className="text-3xl font-bold text-white mb-3">
          {userData.credits}
        </div>
        <Link href="/settings/payment">
          <button className="w-full py-2 px-4 bg-white hover:bg-gray-100 text-purple-600 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
            <CreditCard size={18} />
            チャージする
          </button>
        </Link>
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
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-gray-400 hover:text-red-400 mt-2"
        >
          <span className="text-sm font-medium">ログアウト</span>
        </button>
      </div>
    </aside>
  );
}

