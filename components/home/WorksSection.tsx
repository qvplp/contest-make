'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ResponsiveImage from '@/components/ResponsiveImage';
import { Play, ThumbsUp, Eye, Flame } from 'lucide-react';

const works = [
  {
    id: 1,
    thumbnail: '/images/samples/sample1.jpg',
    title: 'ハロウィンの魔女',
    type: 'video' as const,
    likes: 1234,
    views: 5678,
    isHot: true,
  },
  {
    id: 2,
    thumbnail: '/images/samples/sample2.jpg',
    title: 'ダンスするかぼちゃ',
    type: 'image' as const,
    likes: 890,
    views: 3456,
    isHot: false,
  },
  {
    id: 3,
    thumbnail: '/images/samples/sample3.jpg',
    title: 'リアルなお化け屋敷',
    type: 'video' as const,
    likes: 1567,
    views: 6789,
    isHot: true,
  },
  {
    id: 4,
    thumbnail: '/images/samples/sample4.jpg',
    title: '幻想的な魔法陣',
    type: 'image' as const,
    likes: 723,
    views: 2345,
    isHot: false,
  },
  {
    id: 5,
    thumbnail: '/images/samples/sample5.jpg',
    title: 'ホラー映画のようなシーン',
    type: 'video' as const,
    likes: 2100,
    views: 8901,
    isHot: true,
  },
  {
    id: 6,
    thumbnail: '/images/samples/sample6.jpg',
    title: '漫画風のハロウィンキャラ',
    type: 'image' as const,
    likes: 567,
    views: 1876,
    isHot: false,
  },
  {
    id: 7,
    thumbnail: '/images/samples/sample7.jpg',
    title: 'スチームパンクなハロウィン',
    type: 'image' as const,
    likes: 1234,
    views: 4567,
    isHot: false,
  },
  {
    id: 8,
    thumbnail: '/images/samples/sample8.jpg',
    title: 'ダンスパーティーの動画',
    type: 'video' as const,
    likes: 2345,
    views: 9876,
    isHot: true,
  },
];

const WorksSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredWorks = activeTab === 'hot' 
    ? works.filter(work => work.isHot)
    : activeTab === 'new'
    ? works.slice(0, 6)
    : works;

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          🎨 新着作品
        </h2>
        <Link
          href="/contest-posts"
          className="text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium transition-colors whitespace-nowrap"
        >
          すべて見る →
        </Link>
      </div>

      {/* タブナビゲーション */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-2">
        {['all', 'hot', 'new', 'popular'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab === 'all' && 'すべて'}
            {tab === 'hot' && '🔥 HOT'}
            {tab === 'new' && '✨ 新着'}
            {tab === 'popular' && '⭐ 人気'}
          </button>
        ))}
      </div>

      {/* 作品グリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {filteredWorks.map((work) => (
          <Link key={work.id} href={`/contest-posts/${work.id}`}>
            <div className="relative group cursor-pointer">
              <ResponsiveImage
                src={work.thumbnail}
                alt={work.title}
                aspectRatio="1/1"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="group-hover:ring-2 group-hover:ring-purple-600 rounded-lg transition-all"
                overlayContent={
                  <>
                    {work.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/90 transition-colors">
                          <Play className="text-white" fill="white" size={20} />
                        </div>
                      </div>
                    )}
                    {work.isHot && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 rounded text-xs font-bold flex items-center gap-1">
                        <Flame size={12} />
                        HOT
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                        <h3 className="text-white font-semibold text-xs sm:text-sm mb-2 line-clamp-2">
                          {work.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {work.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {work.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WorksSection;

