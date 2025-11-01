'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 認証ページのリスト（サイドバーとヘッダーを表示しない）
  const authPages = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  // 現在のパスが認証ページかどうか
  const isAuthPage = authPages.includes(pathname);

  // メニューを閉じる
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* 認証ページの場合: サイドバーとヘッダーなし */}
      {isAuthPage ? (
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // 通常ページ: サイドバーとヘッダーあり
        <>
          {isLoggedIn ? (
            <div className="flex min-h-screen">
              {/* Sidebar - デスクトップ: 常に表示, モバイル: オーバーレイ */}
              <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
              />

              {/* モバイル用オーバーレイ */}
              {isMobileMenuOpen && (
                <div
                  onClick={closeMobileMenu}
                  className="lg:hidden fixed inset-0 bg-black/50 z-40"
                  aria-hidden="true"
                />
              )}

              {/* Main Content Area */}
              <div className="flex-1 lg:ml-64">
                {/* Header */}
                <Header
                  onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  isMobileMenuOpen={isMobileMenuOpen}
                />

                {/* Page Content */}
                <main className="pt-16">
                  {children}
                </main>

                {/* Footer */}
                <Footer />
              </div>
            </div>
          ) : (
            // ログアウト時
            <div className="min-h-screen">
              <Header
                onMenuClick={() => setIsMobileMenuOpen(true)}
              />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
