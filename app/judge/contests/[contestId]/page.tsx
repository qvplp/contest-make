'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Trophy,
  Heart,
  Eye,
  Filter,
  TrendingUp,
  CheckCircle,
  X,
  Play,
  Award,
} from 'lucide-react';
import { AVAILABLE_CONTESTS, getContestBySlug } from '@/types/contests';
import { JudgingWork, CategoryNominations } from '@/types/judging';

type SortOption = 'votesDesc' | 'votesAsc' | 'likesDesc' | 'likesAsc' | 'viewsDesc' | 'viewsAsc' | 'recent';

// モックデータ: コンテストの作品一覧
const getMockWorks = (contestId: string): JudgingWork[] => {
  return [
    {
      id: '1',
      title: 'おばけハロウィン',
      authorId: 'user1',
      authorName: 'user_123',
      authorAvatar: '/images/avatars/user1.jpg',
      mediaType: 'image',
      mediaSource: '/images/samples/sample1.jpg',
      summary: 'トリックオアトリート！をテーマにしたハロウィンの夜の物語',
      classifications: ['アニメ'],
      aiModels: ['Seedream'],
      tags: ['ハロウィン', 'おばけ'],
      referencedGuideIds: [],
      isHot: true,
      visibility: 'public',
      createdAt: '2025-10-15T10:00:00Z',
      stats: {
        likes: 245,
        comments: 32,
        views: 1234,
      },
      contestId: contestId,
      votes: 245,
      isNominated: false,
    },
    {
      id: '2',
      title: '魔女の宅配便',
      authorId: 'user2',
      authorName: 'artist_456',
      authorAvatar: '/images/avatars/user2.jpg',
      mediaType: 'video',
      mediaSource: '/images/samples/sample2.jpg',
      summary: '魔女が夜空を飛ぶ幻想的なアニメーション',
      classifications: ['アニメ', 'ワークフロー'],
      aiModels: ['Seedance'],
      tags: ['魔女', 'アニメーション'],
      referencedGuideIds: [],
      isHot: false,
      visibility: 'public',
      createdAt: '2025-10-14T15:30:00Z',
      stats: {
        likes: 189,
        comments: 28,
        views: 987,
      },
      contestId: contestId,
      votes: 189,
      isNominated: false,
    },
    {
      id: '3',
      title: 'パンプキンナイト',
      authorId: 'user3',
      authorName: 'creator_789',
      authorAvatar: '/images/avatars/user3.jpg',
      mediaType: 'image',
      mediaSource: '/images/samples/sample3.jpg',
      summary: 'かぼちゃのランタンが並ぶ不気味な夜',
      classifications: ['アニメ'],
      aiModels: ['Dreamina'],
      tags: ['かぼちゃ', 'ランタン'],
      referencedGuideIds: [],
      isHot: false,
      visibility: 'public',
      createdAt: '2025-10-13T09:15:00Z',
      stats: {
        likes: 156,
        comments: 21,
        views: 765,
      },
      contestId: contestId,
      votes: 156,
      isNominated: false,
    },
    {
      id: '4',
      title: '満月の海賊船',
      authorId: 'user4',
      authorName: 'pirate_012',
      authorAvatar: '/images/avatars/user4.jpg',
      mediaType: 'video',
      mediaSource: '/images/samples/sample5.jpg',
      summary: '満月の夜、幽霊船が海を渡る',
      classifications: ['アニメ', 'カメラワーク'],
      aiModels: ['Sora2'],
      tags: ['海賊', '満月'],
      referencedGuideIds: [],
      isHot: false,
      visibility: 'public',
      createdAt: '2025-10-12T14:20:00Z',
      stats: {
        likes: 134,
        comments: 18,
        views: 654,
      },
      contestId: contestId,
      votes: 134,
      isNominated: false,
    },
    {
      id: '5',
      title: 'スチームパンクハロウィン',
      authorId: 'user5',
      authorName: 'steampunk_345',
      authorAvatar: '/images/avatars/user5.jpg',
      mediaType: 'image',
      mediaSource: '/images/samples/sample7.jpg',
      summary: 'スチームパンクな世界観のハロウィン',
      classifications: ['アニメ'],
      aiModels: ['Midjourney v7'],
      tags: ['スチームパンク', 'ハロウィン'],
      referencedGuideIds: [],
      isHot: false,
      visibility: 'public',
      createdAt: '2025-10-11T11:45:00Z',
      stats: {
        likes: 112,
        comments: 15,
        views: 543,
      },
      contestId: contestId,
      votes: 112,
      isNominated: false,
    },
    {
      id: '6',
      title: 'ダンスパーティー',
      authorId: 'user6',
      authorName: 'dancer_678',
      authorAvatar: '/images/avatars/user6.jpg',
      mediaType: 'video',
      mediaSource: '/images/samples/sample8.jpg',
      summary: 'ハロウィンパーティーで踊るキャラクターたち',
      classifications: ['アニメ', 'アニメーション'],
      aiModels: ['Seedance'],
      tags: ['パーティー', 'ダンス'],
      referencedGuideIds: [],
      isHot: false,
      visibility: 'public',
      createdAt: '2025-10-10T16:00:00Z',
      stats: {
        likes: 98,
        comments: 12,
        views: 432,
      },
      contestId: contestId,
      votes: 98,
      isNominated: false,
    },
  ];
};

// カテゴリ一覧（コンテスト詳細ページから取得）
const CONTEST_CATEGORIES = [
  '最優秀ハロウィン雰囲気賞',
  '最優秀キャラクター賞',
  '最優秀アニメーション賞',
  '最優秀ホラー演出賞',
  '観客賞（最多得票）',
];

export default function JudgeContestDetailPage() {
  const { isLoggedIn, isJudge, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const contestId = params.contestId as string;

  const [works, setWorks] = useState<JudgingWork[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('votesDesc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nominations, setNominations] = useState<Map<string, Set<string>>>(new Map()); // category -> workIds
  const [selectedWork, setSelectedWork] = useState<JudgingWork | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // コンテスト情報を取得
  const contest = AVAILABLE_CONTESTS.find((c) => c.id === contestId);

  useEffect(() => {
    if (!isLoggedIn || !isJudge) {
      router.push('/login');
      return;
    }

    if (!contest) {
      router.push('/judge/contests');
      return;
    }

    // モックデータを読み込む
    const mockWorks = getMockWorks(contestId);
    setWorks(mockWorks);

    // localStorageからノミネート情報を復元
    const storedNominations = localStorage.getItem(`judge_nominations_${contestId}`);
    if (storedNominations) {
      try {
        const parsed = JSON.parse(storedNominations);
        const nominationsMap = new Map<string, Set<string>>();
        Object.entries(parsed).forEach(([category, workIds]: [string, any]) => {
          nominationsMap.set(category, new Set(workIds));
        });
        setNominations(nominationsMap);
        // 作品のノミネート状態を更新
        setWorks((prev) =>
          prev.map((work) => {
            let isNominated = false;
            let nominatedCategory: string | undefined;
            nominationsMap.forEach((workIds, category) => {
              if (workIds.has(work.id)) {
                isNominated = true;
                nominatedCategory = category;
              }
            });
            return { ...work, isNominated, nominatedCategory };
          })
        );
      } catch (error) {
        console.error('Failed to load nominations:', error);
      }
    }
  }, [isLoggedIn, isJudge, router, contestId, contest]);

  // ソート処理
  const sortedWorks = useMemo(() => {
    const sorted = [...works];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'votesDesc':
          return b.votes - a.votes;
        case 'votesAsc':
          return a.votes - b.votes;
        case 'likesDesc':
          return b.stats.likes - a.stats.likes;
        case 'likesAsc':
          return a.stats.likes - b.stats.likes;
        case 'viewsDesc':
          return b.stats.views - a.stats.views;
        case 'viewsAsc':
          return a.stats.views - b.stats.views;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    return sorted;
  }, [works, sortBy]);

  // カテゴリフィルター
  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'all') {
      return sortedWorks;
    }
    // カテゴリフィルターは将来的に作品のカテゴリ情報と照合する
    return sortedWorks;
  }, [sortedWorks, selectedCategory]);

  // ノミネート処理
  const handleNominate = (workId: string, category: string | null) => {
    setNominations((prev) => {
      const newNominations = new Map(prev);
      
      // カテゴリが空文字列またはnullの場合は、すべてのカテゴリから削除（ノミネート解除）
      if (!category || category === '') {
        newNominations.forEach((ids, cat) => {
          ids.delete(workId);
          if (ids.size === 0) {
            newNominations.delete(cat);
          } else {
            newNominations.set(cat, ids);
          }
        });
      } else {
        // カテゴリが指定されている場合
        if (!newNominations.has(category)) {
          newNominations.set(category, new Set());
        }
        const workIds = newNominations.get(category)!;
        
        // トグル処理：既にノミネートされている場合は解除、されていない場合は追加
        if (workIds.has(workId)) {
          workIds.delete(workId);
          if (workIds.size === 0) {
            newNominations.delete(category);
          }
        } else {
          // 他のカテゴリからも削除（1作品は1カテゴリのみ）
          newNominations.forEach((ids, cat) => {
            if (cat !== category && ids.has(workId)) {
              ids.delete(workId);
              if (ids.size === 0) {
                newNominations.delete(cat);
              }
            }
          });
          workIds.add(workId);
          newNominations.set(category, workIds);
        }
      }

      // localStorageに保存
      const serialized: Record<string, string[]> = {};
      newNominations.forEach((workIds, cat) => {
        serialized[cat] = Array.from(workIds);
      });
      localStorage.setItem(`judge_nominations_${contestId}`, JSON.stringify(serialized));

      return newNominations;
    });
  };

  // nominationsの変更に応じてworksのノミネート状態を更新
  useEffect(() => {
    setWorks((prev) =>
      prev.map((work) => {
        let isNominated = false;
        let nominatedCategory: string | undefined;
        nominations.forEach((workIds, cat) => {
          if (workIds.has(work.id)) {
            isNominated = true;
            nominatedCategory = cat;
          }
        });
        return { ...work, isNominated, nominatedCategory };
      })
    );
  }, [nominations]);

  // モーダルが開いている場合、nominationsの変更に応じて選択された作品の状態も更新
  useEffect(() => {
    if (selectedWork && isModalOpen) {
      let isNominated = false;
      let nominatedCategory: string | undefined;
      nominations.forEach((workIds, cat) => {
        if (workIds.has(selectedWork.id)) {
          isNominated = true;
          nominatedCategory = cat;
        }
      });
      setSelectedWork((prev) => {
        if (!prev) return prev;
        return { ...prev, isNominated, nominatedCategory };
      });
    }
  }, [nominations, selectedWork?.id, isModalOpen]);

  // カテゴリごとのノミネート一覧
  const categoryNominations: CategoryNominations[] = useMemo(() => {
    return CONTEST_CATEGORIES.map((category) => {
      const workIds = nominations.get(category) || new Set();
      const nominatedWorks = works.filter((work) => workIds.has(work.id));
      return {
        category,
        works: nominatedWorks,
      };
    });
  }, [nominations, works]);

  if (!isLoggedIn || !isJudge || !contest) {
    return null;
  }

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* ヘッダー */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/judge/contests')}
            className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2"
          >
            ← 審査一覧に戻る
          </button>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-400" size={40} />
            {contest.title} - 審査
          </h1>
          <p className="text-gray-400">{contest.description}</p>
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
                <option value="votesDesc">投票数が多い順</option>
                <option value="votesAsc">投票数が少ない順</option>
                <option value="likesDesc">いいね数が多い順</option>
                <option value="likesAsc">いいね数が少ない順</option>
                <option value="viewsDesc">閲覧数が多い順</option>
                <option value="viewsAsc">閲覧数が少ない順</option>
                <option value="recent">投稿が新しい順</option>
              </select>
            </div>

            {/* カテゴリフィルター */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter size={16} />
                カテゴリー
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="all">すべてのカテゴリー</option>
                {CONTEST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ノミネート一覧セクション */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-yellow-400" size={24} />
            ノミネート一覧
          </h2>
          <div className="space-y-4">
            {categoryNominations.map((categoryNomination) => (
              <div key={categoryNomination.category} className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-purple-400">
                  {categoryNomination.category} ({categoryNomination.works.length}件)
                </h3>
                {categoryNomination.works.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categoryNomination.works.map((work) => (
                      <span
                        key={work.id}
                        className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {work.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">ノミネート作品なし</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 作品一覧 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">応募作品一覧 ({filteredWorks.length}件)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorks.map((work) => {
              const isNominated = work.isNominated || false;
              return (
                <div
                  key={work.id}
                  className={`bg-gray-800/50 rounded-xl overflow-hidden border transition group ${
                    isNominated
                      ? 'border-yellow-500 ring-2 ring-yellow-500/50'
                      : 'border-gray-700 hover:border-purple-600'
                  }`}
                >
                  {/* メディア */}
                  <div
                    className="aspect-square relative cursor-pointer"
                    onClick={() => {
                      // 最新のworks状態から選択された作品を取得
                      const currentWork = works.find((w) => w.id === work.id) || work;
                      setSelectedWork(currentWork);
                      setIsModalOpen(true);
                    }}
                  >
                    <Image
                      src={work.mediaSource}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    {work.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Play className="text-white" size={48} />
                      </div>
                    )}
                    {isNominated && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Award size={12} />
                        ノミネート
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm">
                        <Eye size={14} />
                        {work.stats.views}
                      </div>
                    </div>
                  </div>

                  {/* 情報 */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate">{work.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">by {work.authorName}</p>

                    {/* 統計 */}
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1 text-red-400">
                        <Heart size={14} />
                        <span>{work.stats.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Trophy size={14} />
                        <span>{work.votes}票</span>
                      </div>
                    </div>

                    {/* ノミネートボタン */}
                    <div className="space-y-2">
                      <select
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={work.nominatedCategory || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          const category = e.target.value;
                          // 空文字列の場合はノミネート解除、それ以外はノミネート/変更
                          handleNominate(work.id, category || null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <option value="">カテゴリを選択してノミネート</option>
                        {CONTEST_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}にノミネート
                          </option>
                        ))}
                      </select>
                      {isNominated && work.nominatedCategory && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNominate(work.id, null);
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 relative z-10"
                        >
                          <X size={14} />
                          ノミネート解除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWorks.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">該当する作品がありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 作品詳細モーダル */}
      {isModalOpen && selectedWork && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedWork.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              {/* メディア */}
              <div className="aspect-video relative mb-6 bg-black rounded-xl overflow-hidden">
                {selectedWork.mediaType === 'video' ? (
                  <video src={selectedWork.mediaSource} controls className="w-full h-full">
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={selectedWork.mediaSource}
                    alt={selectedWork.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* 作品情報 */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">作者</h3>
                  <p className="text-gray-300">{selectedWork.authorName}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">説明</h3>
                  <p className="text-gray-300">{selectedWork.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">統計</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-red-400" />
                      <span>{selectedWork.stats.likes}いいね</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-purple-400" />
                      <span>{selectedWork.votes}票</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-blue-400" />
                      <span>{selectedWork.stats.views}閲覧</span>
                    </div>
                  </div>
                </div>

                {/* ノミネート */}
                <div>
                  <h3 className="font-semibold mb-2">ノミネート</h3>
                  <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={selectedWork.nominatedCategory || ''}
                    onChange={(e) => {
                      const category = e.target.value;
                      // 空文字列の場合はノミネート解除、それ以外はノミネート/変更
                      handleNominate(selectedWork.id, category || null);
                    }}
                  >
                    <option value="">カテゴリを選択してノミネート</option>
                    {CONTEST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {selectedWork.nominatedCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        handleNominate(selectedWork.id, null);
                      }}
                      className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                    >
                      <X size={14} />
                      ノミネート解除
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

