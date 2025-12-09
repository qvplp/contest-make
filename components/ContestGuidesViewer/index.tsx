'use client';

import React from 'react';
import { ContestGuidesViewerProps } from '@/modules/contest/application/ContestGuidesViewerDto';
import ContestGuidesViewerHeader from './ContestGuidesViewerHeader';
import GuideCard from './GuideCard';
import ContestGuidesViewerStyles from './ContestGuidesViewerStyles';

/**
 * コンテストに関連する攻略記事を表示するメインコンポーネント
 * ヘッダー、ガイドカードリスト、スタイルを統合
 */
export default function ContestGuidesViewer({
  guides,
  contestSlug,
  contestDisplayName,
}: ContestGuidesViewerProps) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <ContestGuidesViewerHeader />

      <div className="relative">
        {/* スクロール可能なコンテナ */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-4 sm:gap-6" style={{ width: 'max-content' }}>
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </div>

      <ContestGuidesViewerStyles />
    </section>
  );
}

