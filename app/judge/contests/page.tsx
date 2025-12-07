'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { AVAILABLE_CONTESTS, getContestScheduleStatus, ContestScheduleStatus } from '@/types/contests';

type SortOption = 'endDateAsc' | 'endDateDesc' | 'startDateAsc' | 'startDateDesc';
type ScheduleFilter = 'all' | ContestScheduleStatus;

export default function JudgeContestsPage() {
  const { isLoggedIn, isJudge } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>('endDateDesc');
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('all');

  // ログイン・審査員チェック
  if (!isLoggedIn || !isJudge) {
    router.push('/login');
    return null;
  }

  // 審査可能なコンテストを取得（応募終了後、結果発表前まで）
  const judgableContests = useMemo(() => {
    return AVAILABLE_CONTESTS.map((contest) => ({
      ...contest,
      scheduleStatus: getContestScheduleStatus(contest),
    })).filter((contest) => {
      // 審査可能なコンテスト: 応募終了後、結果発表前まで
      return (
        contest.scheduleStatus === 'review' ||
        contest.scheduleStatus === 'announcement' ||
        contest.scheduleStatus === 'ended'
      );
    });
  }, []);

  // ソート処理
  const sortedContests = useMemo(() => {
    const sorted = [...judgableContests];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'endDateAsc':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'endDateDesc':
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        case 'startDateAsc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'startDateDesc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });
    return sorted;
  }, [judgableContests, sortBy]);

  // スケジュールフィルター
  const filteredContests = useMemo(() => {
    if (scheduleFilter === 'all') {
      return sortedContests;
    }
    return sortedContests.filter((contest) => contest.scheduleStatus === scheduleFilter);
  }, [sortedContests, scheduleFilter]);

  const getScheduleStatusLabel = (status: ContestScheduleStatus): string => {
    switch (status) {
      case 'upcoming':
        return '開催前';
      case 'submission':
        return '応募期間';
      case 'review':
        return '審査期間';
      case 'announcement':
        return '結果発表待ち';
      case 'ended':
        return '終了';
      default:
        return '';
    }
  };

  const getScheduleStatusColor = (status: ContestScheduleStatus): string => {
    switch (status) {
      case 'review':
        return 'bg-purple-600 text-white';
      case 'announcement':
        return 'bg-yellow-600 text-white';
      case 'ended':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-400" size={40} />
            コンテスト審査
          </h1>
          <p className="text-gray-400">
            審査可能なコンテスト一覧から、コンテストを選択して審査を開始してください
          </p>
        </div>

        {/* フィルター・ソートバー */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* ソート */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={16} />
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="endDateDesc">終了日が新しい順</option>
                <option value="endDateAsc">終了日が古い順</option>
                <option value="startDateDesc">開始日が新しい順</option>
                <option value="startDateAsc">開始日が古い順</option>
              </select>
            </div>

            {/* スケジュールフィルター */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter size={16} />
                スケジュール
              </label>
              <select
                value={scheduleFilter}
                onChange={(e) => setScheduleFilter(e.target.value as ScheduleFilter)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="all">すべて</option>
                <option value="review">審査期間</option>
                <option value="announcement">結果発表待ち</option>
                <option value="ended">終了</option>
              </select>
            </div>
          </div>
        </div>

        {/* コンテスト一覧 */}
        {filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => (
              <Link
                key={contest.id}
                href={`/judge/contests/${contest.id}`}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
              >
                {/* サムネイル */}
                <div className="relative h-48 bg-gray-900">
                  <Image
                    src={contest.thumbnail}
                    alt={contest.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getScheduleStatusColor(
                        contest.scheduleStatus
                      )}`}
                    >
                      {getScheduleStatusLabel(contest.scheduleStatus)}
                    </span>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">
                    {contest.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {contest.description}
                  </p>

                  {/* 統計情報 */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Trophy size={16} />
                      <span>{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span>応募: {contest.submissions}件</span>
                    </div>
                  </div>

                  {/* スケジュール情報 */}
                  <div className="space-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>開始: {formatDate(contest.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>終了: {formatDate(contest.endDate)}</span>
                    </div>
                    {contest.reviewStartDate && contest.reviewEndDate && (
                      <div className="flex items-center gap-2 text-purple-400">
                        <Clock size={14} />
                        <span>
                          審査: {formatDate(contest.reviewStartDate)} -{' '}
                          {formatDate(contest.reviewEndDate)}
                        </span>
                      </div>
                    )}
                    {contest.resultAnnouncementDate && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Calendar size={14} />
                        <span>発表: {formatDate(contest.resultAnnouncementDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">審査を開始</span>
                    <ArrowRight
                      size={20}
                      className="text-gray-400 group-hover:text-purple-400 transition"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">審査可能なコンテストがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}


