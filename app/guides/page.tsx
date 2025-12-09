'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ThumbsUp,
  MessageCircle,
  Eye,
  TrendingUp,
  Filter,
  Plus,
  Sparkles,
  Flame,
  Cpu,
  Trophy,
  X,
} from 'lucide-react';
import { StaticContestQueryService } from '@/modules/contest/infra/StaticContestQueryService';

type Classification = 'HOT' | 'アニメ' | '漫画' | '実写' | 'カメラワーク' | 'ワークフロー' | 'AIモデル';

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

interface Guide {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  excerpt: string;
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  isHot: boolean;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  tags: string[];
  contestTag?: string; // コンテストタグ（例: "Halloween Creation Cup 2025"）
}

function GuidesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contestQuery = useMemo(() => new StaticContestQueryService(), []);

  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassifications, setSelectedClassifications] = useState<(Classification | 'contest')[]>([]);
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel | 'all'>('all');

  useEffect(() => {
    const tabs = searchParams.get('tabs');
    const model = searchParams.get('model');
    
    if (tabs) {
      const tabArray = tabs.split(',').filter((tab) => 
        ['HOT', 'アニメ', '漫画', '実写', 'カメラワーク', 'ワークフロー', 'AIモデル', 'contest'].includes(tab)
      ) as (Classification | 'contest')[];
      setSelectedClassifications(tabArray);
      
      if (tabArray.includes('AIモデル') && model) {
        setSelectedAIModel(model as AIModel);
      } else {
        setSelectedAIModel('all');
      }
    } else {
      setSelectedClassifications([]);
      setSelectedAIModel('all');
    }
  }, [searchParams]);

  const guides: Guide[] = [
    {
      id: 1,
      title: 'ハロウィン雰囲気を出すプロンプトテクニック10選',
      author: 'AIマスター',
      authorAvatar: '/images/avatars/user1.jpg',
      thumbnail: '/images/samples/sample1.jpg',
      excerpt: '不気味で幻想的なハロウィンの雰囲気を作り出すためのプロンプトのコツを解説します。',
      category: 'プロンプト技術',
      classifications: ['アニメ', 'カメラワーク', 'AIモデル'],
      aiModels: ['Seedream', 'Midjourney v7'],
      isHot: true,
      likes: 342,
      comments: 45,
      views: 2345,
      createdAt: '2025-10-20T10:00:00Z',
      tags: ['ハロウィン', 'プロンプト', '初心者向け'],
      contestTag: 'Halloween Creation Cup 2025',
    },
    {
      id: 2,
      title: 'Seedreamで幽霊を描く方法',
      author: 'クリエイター123',
      authorAvatar: '/images/avatars/user2.jpg',
      thumbnail: '/images/samples/sample2.jpg',
      excerpt: 'Seedreamを使って透明感のある幽霊キャラクターを作成する手法を紹介します。',
      category: 'モデル別攻略',
      classifications: ['アニメ', 'ワークフロー', 'AIモデル'],
      aiModels: ['Seedream'],
      isHot: true,
      likes: 278,
      comments: 32,
      views: 1876,
      createdAt: '2025-10-19T14:30:00Z',
      tags: ['Seedream', 'キャラクター', '中級者向け'],
    },
    {
      id: 3,
      title: 'アニメーション制作の基本：静止画から動画へ',
      author: 'アニメーター',
      authorAvatar: '/images/avatars/user3.jpg',
      thumbnail: '/images/samples/sample3.jpg',
      excerpt: '画像から動画生成の基本的なワークフローと、より自然な動きを作るコツを解説。',
      category: 'アニメーション',
      classifications: ['アニメ', 'ワークフロー'],
      aiModels: [],
      isHot: false,
      likes: 189,
      comments: 28,
      views: 1543,
      createdAt: '2025-10-18T09:15:00Z',
      tags: ['アニメーション', 'チュートリアル', '動画生成'],
    },
    {
      id: 4,
      title: 'ホラー演出のためのライティングテクニック',
      author: 'ライティングプロ',
      authorAvatar: '/images/avatars/user4.jpg',
      thumbnail: '/images/samples/sample4.jpg',
      excerpt: '恐怖感を演出するライティング手法と、プロンプトでの光の表現方法を紹介。',
      category: 'エフェクト・演出',
      classifications: ['実写', 'カメラワーク'],
      aiModels: [],
      isHot: false,
      likes: 156,
      comments: 19,
      views: 1234,
      createdAt: '2025-10-17T16:45:00Z',
      tags: ['ホラー', 'ライティング', '演出'],
    },
    {
      id: 5,
      title: 'かぼちゃのランタンを美しく描くコツ',
      author: 'パンプキンマスター',
      authorAvatar: '/images/avatars/user5.jpg',
      thumbnail: '/images/samples/sample2.jpg',
      excerpt: '定番のハロウィンアイテム、かぼちゃのランタンをリアルかつ魅力的に描く方法。',
      category: 'オブジェクト制作',
      classifications: ['実写', 'カメラワーク'],
      aiModels: [],
      isHot: true,
      likes: 134,
      comments: 15,
      views: 987,
      createdAt: '2025-10-16T11:20:00Z',
      tags: ['ハロウィン', 'オブジェクト', '初心者向け'],
    },
    {
      id: 6,
      title: '魔女のキャラクターデザイン完全ガイド',
      author: 'キャラデザイナー',
      authorAvatar: '/images/avatars/user6.jpg',
      thumbnail: '/images/samples/sample5.jpg',
      excerpt: '魅力的な魔女キャラクターを作成するためのデザイン理論とプロンプト例。',
      category: 'キャラクターデザイン',
      classifications: ['漫画', 'アニメ'],
      aiModels: [],
      isHot: false,
      likes: 98,
      comments: 12,
      views: 765,
      createdAt: '2025-10-15T13:00:00Z',
      tags: ['キャラクター', 'デザイン', '魔女'],
    },
    {
      id: 7,
      title: '実写風ポートレートの作り方',
      author: 'フォトリアリストプロ',
      authorAvatar: '/images/avatars/user7.jpg',
      thumbnail: '/images/samples/sample6.jpg',
      excerpt: 'AIで本物の写真のような実写風ポートレートを生成するテクニック。',
      category: 'ポートレート',
      classifications: ['実写', 'カメラワーク'],
      aiModels: [],
      isHot: true,
      likes: 245,
      comments: 38,
      views: 1987,
      createdAt: '2025-10-14T10:00:00Z',
      tags: ['実写', 'ポートレート', 'リアル'],
    },
    {
      id: 8,
      title: '漫画風イラストの効率的なワークフロー',
      author: 'マンガクリエイター',
      authorAvatar: '/images/avatars/user8.jpg',
      thumbnail: '/images/samples/sample7.jpg',
      excerpt: '漫画風イラストを効率的に作成するためのワークフローとプロンプト戦略。',
      category: 'ワークフロー',
      classifications: ['漫画', 'ワークフロー'],
      aiModels: [],
      isHot: false,
      likes: 167,
      comments: 24,
      views: 1432,
      createdAt: '2025-10-13T15:30:00Z',
      tags: ['漫画', 'ワークフロー', '効率化'],
    },
  ];

  const categories = [
    'all',
    'プロンプト技術',
    'モデル別攻略',
    'アニメーション',
    'エフェクト・演出',
    'オブジェクト制作',
    'キャラクターデザイン',
    'ポートレート',
    'ワークフロー',
  ];

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

  const handleClassificationToggle = (classification: Classification | 'contest') => {
    setSelectedClassifications((prev) => {
      const newSelections = prev.includes(classification)
        ? prev.filter((c) => c !== classification)
        : [...prev, classification];
      
      // URLパラメータを更新
      const params = new URLSearchParams(searchParams.toString());
      if (newSelections.length === 0) {
        params.delete('tabs');
        params.delete('model');
      } else {
        params.set('tabs', newSelections.join(','));
        if (!newSelections.includes('AIモデル')) {
          params.delete('model');
          setSelectedAIModel('all');
        }
      }
      router.push(`/guides?${params.toString()}`, { scroll: false });
      
      return newSelections;
    });
  };

  const handleAIModelChange = (model: AIModel | 'all') => {
    setSelectedAIModel(model);
    const params = new URLSearchParams(searchParams.toString());
    if (model === 'all') {
      params.delete('model');
    } else {
      params.set('model', model);
    }
    router.push(`/guides?${params.toString()}`, { scroll: false });
  };

  // 記事が選択された分類にどれだけマッチしているかを計算
  const getMatchCount = (guide: Guide): number => {
    if (selectedClassifications.length === 0) return 0;
    
    let matchCount = 0;
    
    for (const classification of selectedClassifications) {
      if (classification === 'contest') {
        // コンテストタブが選択されている場合
        const activeContests = contestQuery.getActive();
        const activeContestDisplayNames = activeContests.map((c) => c.displayName);
        if (guide.contestTag && activeContestDisplayNames.includes(guide.contestTag)) {
          matchCount++;
        }
      } else if (classification === 'HOT') {
        if (guide.isHot) {
          matchCount++;
        }
      } else if (classification === 'AIモデル') {
        if (guide.classifications.includes('AIモデル')) {
          matchCount++;
        }
      } else {
        if (guide.classifications.includes(classification)) {
          matchCount++;
        }
      }
    }
    
    return matchCount;
  };

  // フィルタリングとソート
  const filteredAndSortedGuides = [...guides]
    .filter((guide) => {
      // 分類が選択されていない場合はすべて表示
      if (selectedClassifications.length === 0) {
        const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;
        const searchMatch =
          searchQuery === '' ||
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          guide.aiModels.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));
        return categoryMatch && searchMatch;
      }

      // OR条件でフィルタリング（選択された分類のいずれかを含む）
      let classificationMatch = false;
      
      for (const classification of selectedClassifications) {
        if (classification === 'contest') {
          const activeContests = contestQuery.getActive();
          const activeContestDisplayNames = activeContests.map((c) => c.displayName);
          if (guide.contestTag && activeContestDisplayNames.includes(guide.contestTag)) {
            classificationMatch = true;
            break;
          }
        } else if (classification === 'HOT') {
          if (guide.isHot) {
            classificationMatch = true;
            break;
          }
        } else if (classification === 'AIモデル') {
          if (guide.classifications.includes('AIモデル')) {
            if (selectedAIModel === 'all' || guide.aiModels.includes(selectedAIModel)) {
              classificationMatch = true;
              break;
            }
          }
        } else {
          if (guide.classifications.includes(classification)) {
            classificationMatch = true;
            break;
          }
        }
      }

      if (!classificationMatch) return false;

      const categoryMatch = selectedCategory === 'all' || guide.category === selectedCategory;

      const searchMatch =
        searchQuery === '' ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        guide.aiModels.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && searchMatch;
    })
    .map((guide) => ({
      ...guide,
      matchCount: getMatchCount(guide),
    }))
    .sort((a, b) => {
      // マッチ数が多い順
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      // マッチ数が同じ場合はいいね数でソート
      return b.likes - a.likes;
    })
    .map(({ matchCount, ...guide }) => guide); // matchCountを削除

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="text-purple-400" size={28} />
                攻略・使い方
              </h1>
              <p className="text-sm sm:text-base text-gray-400">AIクリエイターのためのナレッジベース</p>
            </div>
            <Link
              href="/guides/new"
              className="bg-purple-600 hover:bg-purple-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              <span>記事を投稿</span>
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* すべてタブ - 選択をクリア */}
            <button
              onClick={() => {
                setSelectedClassifications([]);
                const params = new URLSearchParams(searchParams.toString());
                params.delete('tabs');
                params.delete('model');
                router.push(`/guides?${params.toString()}`, { scroll: false });
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition ${
                selectedClassifications.length === 0
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              すべて
            </button>
            
            {/* 分類タブ - 複数選択可能 */}
            {classificationTabs
              .filter((tab) => tab.value !== 'all')
              .map((tab) => {
                const isSelected = selectedClassifications.includes(tab.value as Classification);
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleClassificationToggle(tab.value as Classification)}
                    className={`px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                      isSelected
                        ? tab.value === 'HOT'
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/50'
                          : tab.value === 'AIモデル'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {Icon && (
                      <Icon size={18} className={isSelected && tab.value === 'HOT' ? 'animate-pulse' : ''} />
                    )}
                    {tab.label}
                    {isSelected && (
                      <span className="ml-1 text-xs opacity-75">✓</span>
                    )}
                  </button>
                );
              })}
            
            {/* コンテストタブ - 開催中のコンテストがある場合のみ表示 */}
            {contestQuery.getActive().length > 0 && (
              <button
                onClick={() => handleClassificationToggle('contest')}
                className={`px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  selectedClassifications.includes('contest')
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/50'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Trophy size={18} />
                コンテスト
                {selectedClassifications.includes('contest') && (
                  <span className="ml-1 text-xs opacity-75">✓</span>
                )}
              </button>
            )}
          </div>
          
          {/* 選択された分類の表示 */}
          {selectedClassifications.length > 0 && (
            <div className="mt-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4 border border-purple-700/50">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-purple-400">選択中:</span>
                {selectedClassifications.map((classification) => {
                  const tab = classificationTabs.find((t) => t.value === classification) || 
                    (classification === 'contest' ? { label: 'コンテスト', icon: Trophy } : null);
                  if (!tab) return null;
                  const Icon = tab.icon;
                  return (
                    <span
                      key={classification}
                      className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {Icon && <Icon size={14} />}
                      {tab.label}
                    </span>
                  );
                })}
                <button
                  onClick={() => {
                    setSelectedClassifications([]);
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete('tabs');
                    params.delete('model');
                    router.push(`/guides?${params.toString()}`, { scroll: false });
                  }}
                  className="ml-auto text-gray-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {selectedClassifications.includes('AIモデル') && (
            <div className="mt-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Cpu size={20} className="text-cyan-400" />
                <span className="font-semibold">モデルで絞り込み</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAIModelChange('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                    selectedAIModel === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  すべてのモデル
                </button>
                {aiModelOptions.map((model) => (
                  <button
                    key={model}
                    onClick={() => handleAIModelChange(model)}
                    className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                      selectedAIModel === model ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 sm:mb-8 border border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="記事やAIモデルを検索..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Filter size={16} />
              カテゴリー
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'すべてのカテゴリー' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              並び替え
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="popular">人気順</option>
              <option value="recent">新着順</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredAndSortedGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
            >
              <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-800">
                <Image
                  src={guide.thumbnail}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {guide.category}
                </div>
                {guide.isHot && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-pulse">
                    <Flame size={14} />
                    HOT
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition">
                  {guide.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">{guide.excerpt}</p>

                {guide.aiModels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {guide.aiModels.map((model) => (
                      <span key={model} className="text-xs bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-cyan-300 px-2 py-1 rounded border border-cyan-700/50 flex items-center gap-1">
                        <Cpu size={12} />
                        {model}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  {guide.classifications
                    .filter((c) => c !== 'AIモデル')
                    .map((classification) => (
                      <span key={classification} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded border border-gray-600">
                        {classification}
                      </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <span className="text-gray-400">{guide.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={14} />
                      {guide.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {guide.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {guide.views}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredAndSortedGuides.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">該当する記事がありません</p>
            <p className="text-gray-500 text-sm">別の分類やカテゴリーを試してみてください</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <Suspense fallback={<div className="bg-gray-950 min-h-screen"><div className="container mx-auto px-6 py-16 text-gray-400">読み込み中...</div></div>}>
      <GuidesPageContent />
    </Suspense>
  );
}

