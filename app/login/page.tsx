'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // モック: 1秒後にログイン
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'h.iijima',
        email: 'h.iijima@example.com',
        avatar: '/images/avatar-placeholder.png',
      };
      
      login(mockUser);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* ロゴエリア */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="text-6xl mb-4">🦇</div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              AnimeHub
            </h1>
            <p className="text-gray-400">AIで創作を楽しもう</p>
          </div>
        </div>

        {/* ログインカード */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
          
          {/* Google ログインボタン */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Googleでログイン</span>
              </>
            )}
          </button>

          {/* 注意事項 */}
          <p className="mt-6 text-xs text-gray-400 text-center">
            ログインすることで、
            <a href="/terms" className="text-red-400 hover:underline">利用規約</a>
            および
            <a href="/privacy" className="text-red-400 hover:underline">プライバシーポリシー</a>
            に同意したものとみなされます。
          </p>
        </div>

        {/* 戻るリンク */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-white transition text-sm">
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}

