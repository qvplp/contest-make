'use client';

import React from 'react';

/**
 * スクロールバーを非表示にするスタイル定義
 */
export default function ContestGuidesViewerStyles() {
  return (
    <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  );
}

