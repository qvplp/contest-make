'use client';

import Link from 'next/link';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isLoggedIn, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-2xl font-bold text-red-500">🦇</span>
          <span className="text-xl font-bold">AnimeHub</span>
        </Link>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/contests" className="hover:text-red-400 transition">
            コンテスト
          </Link>
          <Link href="/guides" className="hover:text-red-400 transition">
            攻略
          </Link>
        </nav>

        {/* ユーザーエリア */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">92クレジット</span>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <User size={24} />
                <span className="hidden sm:inline">{user?.name}</span>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogIn size={20} />
              <span>ログイン</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
