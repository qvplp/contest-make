import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sousaku.AI - AI創作プラットフォーム',
  description: 'AIを使った創作活動のためのプラットフォーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar - 全ページで表示（ログイン時のみ） */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64">
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
        </AuthProvider>
      </body>
    </html>
  );
}
