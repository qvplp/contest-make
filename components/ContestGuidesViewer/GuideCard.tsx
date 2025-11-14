'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { Guide } from '@/types/ContestGuidesViewer';

interface GuideCardProps {
  guide: Guide;
}

/**
 * 個別のガイドカードコンポーネント
 * サムネイル、タイトル、著者情報、統計情報を表示
 */
export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link
      href={`/guides/${guide.id}`}
      className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group flex-shrink-0 w-[280px] sm:w-[320px]"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-800">
        <Image
          src={guide.thumbnail}
          alt={guide.title}
          fill
          sizes="(max-width: 640px) 280px, 320px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {guide.category}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition">
          {guide.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">{guide.excerpt}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
            <span className="text-gray-400 text-xs sm:text-sm">{guide.author}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              <span className="text-xs">{guide.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span className="text-xs">{guide.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="text-xs">{guide.views}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

