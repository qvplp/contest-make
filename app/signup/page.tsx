'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    // パスワードの最小長チェック
    if (formData.password.length < 8) {
      setError('パスワードは8文字以上である必要があります');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 実際のサインアップAPI呼び出し
      console.log('Signup:', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // モック: 2秒後に登録成功 → ログインページへ
      setTimeout(() => {
        setIsLoading(false);
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('登録に失敗しました');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-3xl font-bold mb-2">
            <span className="text-4xl">🦇</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AnimeHub
            </span>
          </div>
          <p className="text-gray-400">AI創作プラットフォーム</p>
        </div>

        {/* サインアップフォーム */}
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ユーザー名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                ユーザー名
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="ai_creator"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="8文字以上"
              />
            </div>

            {/* パスワード確認 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="パスワードを再入力"
              />
            </div>

            {/* 利用規約 */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-2 focus:ring-purple-600"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                  利用規約
                </Link>
                と
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                  プライバシーポリシー
                </Link>
                に同意します
              </label>
            </div>

            {/* 登録ボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登録中...' : '新規登録'}
            </button>
          </form>

          {/* ログインリンク */}
          <p className="mt-6 text-center text-sm text-gray-400">
            すでにアカウントをお持ちの方は{' '}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

