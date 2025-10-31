'use client';

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

  return (
    <>
      {/* 認証ページの場合: サイドバーとヘッダーなし */}
      {isAuthPage ? (
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // 通常ページ: サイドバーとヘッダーあり
        <div className="flex min-h-screen">
          {/* Sidebar - ログイン時のみ表示 */}
          {isLoggedIn && <Sidebar />}

          {/* Main Content Area */}
          <div className={isLoggedIn ? 'flex-1 ml-64' : 'flex-1'}>
            {/* Header - 全ページで表示 */}
            <Header />

            {/* Page Content */}
            <main className="pt-16">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </div>
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
