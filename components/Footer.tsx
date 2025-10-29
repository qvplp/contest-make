'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ブランド */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sousaku.AI</h3>
            <p className="text-gray-400 text-sm">
              AIで創作を楽しむプラットフォーム
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="font-semibold mb-4">リンク</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/contests" className="hover:text-white transition">
                  コンテスト一覧
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white transition">
                  攻略・使い方
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* SNS */}
          <div>
            <h4 className="font-semibold mb-4">コミュニティ</h4>
            <div className="flex gap-4">
              <a
                href="https://discord.gg/sousaku"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <MessageCircle size={24} />
              </a>
              <a
                href="https://x.com/sousaku_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          © 2025 Sousaku.AI — ハロウィンカップ2025
        </div>
      </div>
    </footer>
  );
}
