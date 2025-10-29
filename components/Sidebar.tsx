'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Sparkles,
  Trophy,
  BookOpen,
  User,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'ホーム', href: '/' },
    { icon: Sparkles, label: 'インスピレーション', href: '/inspiration' },
    { icon: Trophy, label: 'コンテスト', href: '/contests' },
    { icon: BookOpen, label: '攻略・使い方', href: '/guides' },
  ];

  const createMenuItems = [
    { label: 'テキストから画像生成', href: '/create/text-to-image' },
    { label: '画像から動画生成', href: '/create/image-to-video' },
    { label: 'テキストから音楽生成', href: '/create/text-to-music' },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-16 overflow-y-auto custom-scrollbar">
      {/* ユーザー情報 */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.name}</p>
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Zap size={14} />
              <span>92クレジット</span>
            </div>
          </div>
        </div>
      </div>

      {/* メインメニュー */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition group"
            >
              <item.icon size={20} className="text-gray-400 group-hover:text-white" />
              <span className="text-sm text-gray-300 group-hover:text-white">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* 生成メニュー */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">
            生成する
          </h3>
          <div className="space-y-1">
            {createMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 設定とログアウト */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition group mb-2"
        >
          <Settings size={20} className="text-gray-400 group-hover:text-white" />
          <span className="text-sm text-gray-300 group-hover:text-white">
            設定
          </span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 transition group text-left"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-red-400" />
          <span className="text-sm text-gray-300 group-hover:text-red-400">
            ログアウト
          </span>
        </button>
      </div>
    </aside>
  );
}
