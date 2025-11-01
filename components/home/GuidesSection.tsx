'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ResponsiveMediaCard from '@/components/ResponsiveMediaCard';
import { Eye, ThumbsUp, Clock } from 'lucide-react';
import Image from 'next/image';

const tabs = [
  { id: 'all', label: 'すべて' },
  { id: 'hot', label: '🔥 HOT' },
  { id: 'anime', label: '🎬 アニメ' },
  { id: 'realistic', label: '📷 実写' },
];

const guides = [
  {
    id: 1,
    title: 'Sora2で映画レベルの動画を作る完全ガイド',
    thumbnail: '/images/samples/sample1.jpg',
    author: {
      name: 'AIクリエイター太郎',
      avatar: '/images/avatars/user1.jpg',
    },
    views: 15420,
    likes: 892,
    publishedAt: '2日前',
    tags: ['Sora2', 'アニメ', 'チュートリアル'],
  },
  {
    id: 2,
    title: 'Seedreamを使ったキャラクター作成のコツ',
    thumbnail: '/images/samples/sample2.jpg',
    author: {
      name: 'クリエイター花子',
      avatar: '/images/avatars/user2.jpg',
    },
    views: 8200,
    likes: 456,
    publishedAt: '5日前',
    tags: ['Seedream', 'キャラクター', 'プロンプト'],
  },
  {
    id: 3,
    title: 'カメラワークで動画をレベルアップ',
    thumbnail: '/images/samples/sample3.jpg',
    author: {
      name: 'ビデオエキスパート',
      avatar: '/images/avatars/user3.jpg',
    },
    views: 12300,
    likes: 678,
    publishedAt: '1週間前',
    tags: ['カメラワーク', 'テクニック', '実写'],
  },
  {
    id: 4,
    title: 'ワークフロー最適化ガイド',
    thumbnail: '/images/samples/sample4.jpg',
    author: {
      name: 'プロデューサー',
      avatar: '/images/avatars/user4.jpg',
    },
    views: 9800,
    likes: 523,
    publishedAt: '2週間前',
    tags: ['ワークフロー', '効率化', '実践'],
  },
];

const GuidesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          📚 人気の攻略
        </h2>
        <Link
          href="/guides"
          className="text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium transition-colors whitespace-nowrap"
        >
          すべて見る →
        </Link>
      </div>

      {/* タブ */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 攻略グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {guides.map((guide) => (
          <Link key={guide.id} href={`/guides/${guide.id}`}>
            <div className="group">
              {/* サムネイル */}
              <ResponsiveMediaCard
                type="image"
                src={guide.thumbnail}
                alt={guide.title}
                aspectRatio="16/9"
                className="mb-3 sm:mb-4"
                overlay={
                  <div className="absolute top-2 left-2 flex gap-1 sm:gap-2">
                    {guide.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/70 text-white text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                }
              />
              
              {/* 攻略情報 */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {guide.title}
                </h3>
                
                {/* 著者情報 */}
                <div className="flex items-center gap-2">
                  <Image
                    src={guide.author.avatar}
                    alt={guide.author.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                  <span className="text-xs sm:text-sm text-gray-400">
                    {guide.author.name}
                  </span>
                </div>
                
                {/* メタ情報 */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    <span>{guide.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={14} className="sm:w-4 sm:h-4" />
                    <span>{guide.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                    <span>{guide.publishedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GuidesSection;

