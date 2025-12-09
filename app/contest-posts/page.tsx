'use client';

import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  ThumbsUp,
  MessageCircle,
  Eye,
  TrendingUp,
  Clock,
  Cpu,
  Play,
  Trophy,
  Flame,
} from 'lucide-react';
import { useWorks } from '@/contexts/WorksContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Work } from '@/modules/works/domain/Work';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';
import WorkViewerModal from '@/components/works/WorkViewerModal';
import { GetContestSubmissions } from '@/modules/contest/application/GetContestSubmissions';
import { StaticContestSubmissionRepository } from '@/modules/contest/infra/StaticContestSubmissionRepository';
import type { ContestSubmission } from '@/modules/contest/domain/ContestSubmission';

type Classification = 
  | 'HOT' 
  | 'アニメ' 
  | '漫画' 
  | '実写' 
  | 'カメラワーク' 
  | 'ワークフロー'
  | 'AIモデル';

type AIModel = 
  | 'GPT-5'
  | 'Sora2'
  | 'Seedream'
  | 'Seedance'
  | 'Dreamina'
  | 'Omnihuman'
  | 'Hotgen General'
  | 'Claude 4'
  | 'Midjourney v7'
  | 'DALL-E 4';

interface ContestPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  mediaSrc: string;
  type: 'image' | 'video';
  classifications: Classification[];
  aiModels: AIModel[];
  isHot: boolean;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  contest: string;
}

// useSearchParams を使う内部コンポーネント（Suspense境界内で使用）
function ContestPostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeClassification, setActiveClassification] = useState<Classification | 'all'>('all');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel | 'all'>('all');
  const [showAIModelDropdown, setShowAIModelDropdown] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState<ContestPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { userWorks } = useWorks();
  const { user } = useAuth();
  const contestSubmissionsRepo = useMemo(
    () => new StaticContestSubmissionRepository(),
    []
  );
  const getContestSubmissions = useMemo(
    () => new GetContestSubmissions(contestSubmissionsRepo),
    [contestSubmissionsRepo]
  );
  const [remotePosts, setRemotePosts] = useState<ContestPost[]>([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const model = searchParams.get('model');
    if (tab && ['HOT', 'アニメ', '漫画', '実写', 'カメラワーク', 'ワークフロー', 'AIモデル'].includes(tab)) {
      setActiveClassification(tab as Classification);
      if (tab === 'AIモデル' && model) {
        setSelectedAIModel(model as AIModel);
        setShowAIModelDropdown(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const submissions: ContestSubmission[] = getContestSubmissions.execute('halloween2025');
    const mapped: ContestPost[] = submissions.map((s) => ({
      id: String(s.id),
      title: s.title,
      author: s.author,
      authorAvatar: s.imageUrl || '/images/avatars/user1.jpg',
      mediaSrc: s.imageUrl,
      type: s.isVideo ? 'video' : 'image',
      classifications: s.categories as Classification[],
      aiModels: [],
      isHot: s.hasVoted ?? false, // モックに合わせて簡易フラグ
      likes: s.votes,
      comments: 0,
      views: s.views,
      createdAt: s.createdAt,
      contest: 'halloween2025',
    }));
    setRemotePosts(mapped);
  }, [getContestSubmissions]);

  const classificationTabs: { value: Classification | 'all'; label: string; icon?: any }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'HOT', label: 'HOT', icon: Flame },
    { value: 'アニメ', label: 'アニメ' },
    { value: '漫画', label: '漫画' },
    { value: '実写', label: '実写' },
    { value: 'カメラワーク', label: 'カメラワーク' },
    { value: 'ワークフロー', label: 'ワークフロー' },
    { value: 'AIモデル', label: 'AIモデル', icon: Cpu },
  ];

  const aiModelOptions: AIModel[] = [
    'GPT-5',
    'Sora2',
    'Seedream',
    'Seedance',
    'Dreamina',
    'Omnihuman',
    'Hotgen General',
    'Claude 4',
    'Midjourney v7',
    'DALL-E 4',
  ];

  const handleClassificationChange = (classification: Classification | 'all') => {
    setActiveClassification(classification);
    if (classification !== 'AIモデル') {
      setSelectedAIModel('all');
      setShowAIModelDropdown(false);
    } else {
      setShowAIModelDropdown(true);
    }
    const params = new URLSearchParams(searchParams.toString());
    if (classification === 'all') {
      params.delete('tab');
      params.delete('model');
    } else {
      params.set('tab', classification);
      if (classification !== 'AIモデル') {
        params.delete('model');
      }
    }
    router.push(`/contest-posts?${params.toString()}`, { scroll: false });
  };

  const handleAIModelChange = (model: AIModel | 'all') => {
    setSelectedAIModel(model);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'AIモデル');
    if (model === 'all') {
      params.delete('model');
    } else {
      params.set('model', model);
    }
    router.push(`/contest-posts?${params.toString()}`, { scroll: false });
  };

  // ContestPostをWorkに変換
  const convertPostToWork = (post: ContestPost): Work => {
    // userWorksから該当する作品を探す
    const userWork = userWorks.find((w) => w.id === post.id);
    if (userWork) {
      return userWork;
    }

    // モックデータの場合はWork型に変換
    return {
      id: post.id,
      title: post.title,
      authorId: 'unknown',
      authorName: post.author,
      authorAvatar: post.authorAvatar,
      mediaType: post.type,
      mediaSource: post.mediaSrc,
      summary: '',
      classifications: post.classifications,
      aiModels: post.aiModels,
      tags: [],
      referencedGuideIds: [],
      isHot: post.isHot,
      visibility: 'public',
      createdAt: post.createdAt,
      stats: {
        likes: post.likes,
        comments: post.comments,
        views: post.views,
      },
      contestId: post.contest !== 'user' ? post.contest : undefined,
    };
  };

  const handlePostClick = (post: ContestPost) => {
    const work = convertPostToWork(post);
    setSelectedWork(work);
    setIsViewerOpen(true);
  };

  const userContestPosts = useMemo<ContestPost[]>(
    () =>
      userWorks
        .filter((work) => work.visibility === 'public')
        .map((work) => ({
          id: work.id,
          title: work.title,
          author: work.authorName,
          authorAvatar: work.authorAvatar,
          mediaSrc: work.mediaSource,
          type: work.mediaType,
          classifications: work.classifications as Classification[],
          aiModels: work.aiModels as AIModel[],
          isHot: work.isHot,
          likes: work.stats.likes,
          comments: work.stats.comments,
          views: work.stats.views,
          createdAt: work.createdAt,
          contest: work.contestId || 'user',
        })),
    [userWorks],
  );

  const sortedPosts = [...userContestPosts, ...remotePosts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filteredPosts = sortedPosts.filter((post) => {
    let classificationMatch = true;
    if (activeClassification === 'HOT') {
      classificationMatch = post.isHot;
    } else if (activeClassification === 'AIモデル') {
      classificationMatch = post.classifications.includes('AIモデル');
      if (selectedAIModel !== 'all') {
        classificationMatch = classificationMatch && post.aiModels.includes(selectedAIModel);
      }
    } else if (activeClassification !== 'all') {
      classificationMatch = post.classifications.includes(activeClassification);
    }

    const searchMatch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.aiModels.some((model) => model.toLowerCase().includes(searchQuery.toLowerCase()));

    return classificationMatch && searchMatch;
  });

  useEffect(() => {
    setDisplayedPosts(filteredPosts.slice(0, 20));
    setHasMore(filteredPosts.length > 20);
  }, [activeClassification, selectedAIModel, searchQuery, sortBy]);

  const loadMorePosts = () => {
    if (!hasMore) return;
    const currentLength = displayedPosts.length;
    const nextPosts = filteredPosts.slice(currentLength, currentLength + 20);
    if (nextPosts.length > 0) {
      setDisplayedPosts([...displayedPosts, ...nextPosts]);
      setHasMore(currentLength + nextPosts.length < filteredPosts.length);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [displayedPosts, hasMore]);

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Trophy className="text-yellow-400" />
                投稿作品
              </h1>
              <p className="text-gray-400">みんなの素晴らしい作品をチェックしよう</p>
            </div>
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition">← ホームに戻る</Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {classificationTabs.map((tab) => {
              const isActive = activeClassification === tab.value;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleClassificationChange(tab.value)}
                  className={`px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                    isActive
                      ? tab.value === 'HOT'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/50'
                        : tab.value === 'AIモデル'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {Icon && <Icon size={18} className={isActive && tab.value === 'HOT' ? 'animate-pulse' : ''} />}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeClassification === 'AIモデル' && showAIModelDropdown && (
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3"><Cpu size={20} className="text-cyan-400" /><span className="font-semibold">モデルで絞り込み</span></div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleAIModelChange('all')} className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${selectedAIModel === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>すべてのモデル</button>
                {aiModelOptions.map((model) => (
                  <button key={model} onClick={() => handleAIModelChange(model)} className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${selectedAIModel === model ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{model}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="作品を検索..."
                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setSortBy('popular')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${sortBy === 'popular' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                <TrendingUp size={20} />人気順
              </button>
              <button onClick={() => setSortBy('recent')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${sortBy === 'recent' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
                <Clock size={20} />新着順
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 text-gray-400">{filteredPosts.length}件の作品が見つかりました</div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPosts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePostClick(post);
            }}
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition w-full"
          >
            <div className="relative">
              <WorkMediaPreview
                mediaType={post.type}
                src={post.mediaSrc}
                aspectRatio="1/1"
                className="rounded-none"
              />
              {post.isHot && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Flame size={12} className="animate-pulse" />
                  HOT
                </div>
              )}
              {post.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="text-white" size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-semibold mb-2">{post.title}</p>
                  <p className="text-xs text-gray-400 mb-2">{post.author}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-300">
                    <span className="flex items-center gap-1"><ThumbsUp size={12} />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={12} />{post.comments}</span>
                    <span className="flex items-center gap-1"><Eye size={12} />{post.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            </button>
          ))}
        </div>

        {displayedPosts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>該当する投稿が見つかりませんでした。</p>
            <p className="text-sm mt-2">別のタブを選択するか、検索条件を変更してみてください。</p>
          </div>
        )}

        {hasMore && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {!hasMore && displayedPosts.length > 0 && (
          <div className="text-center py-8 text-gray-400">すべての作品を読み込みました</div>
        )}
      </div>

      {/* 作品ビュワーモーダル */}
      <WorkViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedWork(null);
        }}
        work={selectedWork}
      />
    </div>
  );
}

// メインコンポーネント（Suspense境界でラップ）
export default function ContestPostsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-300">読み込み中...</div>}>
      <ContestPostsContent />
    </Suspense>
  );
}
