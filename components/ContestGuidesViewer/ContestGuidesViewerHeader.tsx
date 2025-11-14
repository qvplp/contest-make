'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * 関連する攻略記事セクションのヘッダー
 * タイトルと「もっと見る」リンクを表示
 */
export default function ContestGuidesViewerHeader() {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
        <Sparkles className="text-purple-400 sm:w-7 sm:h-7" size={24} />
        関連する攻略記事
      </h2>
      <Link
        href="/guides?tab=contest"
        className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 transition text-sm sm:text-base"
      >
        もっと見る
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

