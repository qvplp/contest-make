'use client';

import React from 'react';
import Link from 'next/link';
import ResponsiveMediaCard from '@/components/ResponsiveMediaCard';
import { Trophy, Calendar, Users } from 'lucide-react';

const contests = [
  {
    id: 1,
    title: '🎃 ハロウィン創作カップ 2025',
    description: '今年のハロウィンをテーマにした作品を募集中！',
    image: '/images/contests/halloween2025.jpg',
    deadline: '2025-10-31',
    participants: 248,
    prize: '賞金総額 ¥500,000',
    link: '/contest/halloween2025',
  },
  {
    id: 2,
    title: '🎄 クリスマスコンテスト 2025',
    description: 'クリスマスをテーマにした作品を募集！',
    image: '/images/contests/winter2025.jpg',
    deadline: '2025-12-25',
    participants: 156,
    prize: '賞金総額 ¥300,000',
    link: '/contest/christmas2025',
  },
  {
    id: 3,
    title: '🌺 サマーコンテスト 2024',
    description: '夏の思い出をテーマにした作品を募集！',
    image: '/images/contests/summer2024.jpg',
    deadline: '2024-08-31',
    participants: 342,
    prize: '賞金総額 ¥400,000',
    link: '/contest/summer2024',
  },
];

const ContestSection: React.FC = () => {
  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          🏆 開催中のコンテスト
        </h2>
        <Link
          href="/contests"
          className="text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium transition-colors whitespace-nowrap"
        >
          すべて見る →
        </Link>
      </div>

      {/* コンテストグリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {contests.map((contest) => (
          <Link key={contest.id} href={contest.link}>
            <div className="group">
              {/* コンテスト画像 */}
              <ResponsiveMediaCard
                type="image"
                src={contest.image}
                alt={contest.title}
                aspectRatio="16/9"
                className="mb-3 sm:mb-4"
              />
              
              {/* コンテスト情報 */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {contest.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                  {contest.description}
                </p>
                
                {/* メタ情報 */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="sm:w-4 sm:h-4" />
                    <span>{contest.deadline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="sm:w-4 sm:h-4" />
                    <span>{contest.participants}人</span>
                  </div>
                </div>
                
                {/* 賞金 */}
                <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs sm:text-sm font-medium">
                  <Trophy size={14} className="sm:w-4 sm:h-4" />
                  {contest.prize}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContestSection;

