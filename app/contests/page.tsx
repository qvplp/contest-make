'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Users, Heart, Calendar, Clock, Search } from 'lucide-react';

interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  prize: string;
  submissions: number;
  votes: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
}

export default function ContestsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const contests: Contest[] = [
    {
      id: '1',
      title: 'ハロウィン創作カップ2025',
      slug: 'halloween2025',
      description: 'AIの力で最高のハロウィン作品を創造しよう！総額50万円の賞金をかけた創作コンテスト',
      thumbnail: '/images/contests/halloween2025.jpg',
      prize: '¥500,000',
      submissions: 1234,
      votes: 12345,
      startDate: '2025-10-01',
      endDate: '2025-11-01',
      status: 'active',
    },
    {
      id: '2',
      title: 'ウィンターファンタジーコンテスト',
      slug: 'winter2025',
      description: '冬をテーマにした幻想的な作品を募集します',
      thumbnail: '/images/contests/winter2025.jpg',
      prize: '¥300,000',
      submissions: 0,
      votes: 0,
      startDate: '2025-12-01',
      endDate: '2026-01-15',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'サマーポートレートコンテスト',
      slug: 'summer2024',
      description: '夏の思い出を彩るポートレート作品コンテスト',
      thumbnail: '/images/contests/summer2024.jpg',
      prize: '¥400,000',
      submissions: 2345,
      votes: 23456,
      startDate: '2024-07-01',
      endDate: '2024-08-31',
      status: 'ended',
    },
  ];

  // フィルター処理
  const filteredContests = contests.filter((contest) => {
    const statusMatch = statusFilter === 'all' || contest.status === statusFilter;
    const searchMatch =
      searchQuery === '' ||
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status: Contest['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            開催中
          </span>
        );
      case 'upcoming':
        return (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            近日開催
          </span>
        );
      case 'ended':
        return (
          <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            終了
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            コンテスト一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            開催中・過去・今後のコンテストをチェックしよう
          </p>
        </div>

        {/* 検索とフィルター */}
        <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 検索 */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="コンテストを検索..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* ステータスフィルター */}
            <div className="flex gap-2">
              {(['all', 'active', 'upcoming', 'ended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {status === 'all'
                    ? 'すべて'
                    : status === 'active'
                    ? '開催中'
                    : status === 'upcoming'
                    ? '近日開催'
                    : '終了'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* コンテスト一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredContests.map((contest) => (
            <Link
              key={contest.id}
              href={`/contest/${contest.slug}`}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
            >
              {/* サムネイル */}
              <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-800">
                <Image
                  src={contest.thumbnail}
                  alt={contest.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  {getStatusBadge(contest.status)}
                </div>
              </div>

              {/* コンテンツ */}
              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-purple-400 transition">
                  {contest.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                  {contest.description}
                </p>

                {/* 統計 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <Trophy className="text-yellow-400 mx-auto mb-1" size={20} />
                    <div className="text-sm font-semibold">{contest.prize}</div>
                    <div className="text-xs text-gray-500">賞金</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <Users className="text-blue-400 mx-auto mb-1" size={20} />
                    <div className="text-sm font-semibold">{contest.submissions}</div>
                    <div className="text-xs text-gray-500">応募</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                    <Heart className="text-red-400 mx-auto mb-1" size={20} />
                    <div className="text-sm font-semibold">{contest.votes}</div>
                    <div className="text-xs text-gray-500">投票</div>
                  </div>
                </div>

                {/* 日程 */}
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(contest.startDate).toLocaleDateString('ja-JP')} -{' '}
                      {new Date(contest.endDate).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  {contest.status === 'active' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Clock size={16} />
                      <span>
                        締切まで{' '}
                        {Math.ceil(
                          (new Date(contest.endDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                        日
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 結果が0件の場合 */}
        {filteredContests.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">該当するコンテストがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

