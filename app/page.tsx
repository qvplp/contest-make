'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Trophy, 
  BookOpen, 
  Sparkles,
  Flame,
  Cpu,
  ThumbsUp,
  MessageCircle,
  Eye,
} from 'lucide-react';

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
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
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

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [activeClassification, setActiveClassification] = useState<Classification | 'all'>('all');
  const [selectedAIModel, setSelectedAIModel] = useState<AIModel | 'all'>('all');
  const [showAIModelDropdown, setShowAIModelDropdown] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">ログインページへ移動しています...</p>
      </div>
    );
  }

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

  const contestPosts: ContestPost[] = [
    {
      id: 1,
      title: 'ハロウィンの魔女',
      author: 'AIアーティスト',
      authorAvatar: '/images/avatars/user1.jpg',
      thumbnail: '/images/samples/sample1.jpg',
      type: 'image',
      classifications: ['アニメ', 'カメラワーク', 'AIモデル'],
      aiModels: ['Seedream', 'Midjourney v7'],
      isHot: true,
      likes: 542,
      comments: 78,
      views: 3456,
      createdAt: '2025-10-25T10:00:00Z',
      contest: 'halloween2025',
    },
    {
      id: 2,
      title: 'ダンスするかぼちゃ',
      author: 'ビデオクリエイター',
      authorAvatar: '/images/avatars/user2.jpg',
      thumbnail: '/images/samples/sample3.jpg',
      type: 'video',
      classifications: ['アニメ', 'ワークフロー', 'AIモデル'],
      aiModels: ['Sora2', 'Seedance'],
      isHot: false,
      likes: 234,
      comments: 45,
      views: 1876,
      createdAt: '2025-10-24T14:30:00Z',
      contest: 'halloween2025',
    },
    {
      id: 3,
      title: 'リアルなお化け屋敷',
      author: 'フォトリアリスト',
      authorAvatar: '/images/avatars/user3.jpg',
      thumbnail: '/images/samples/sample4.jpg',
      type: 'image',
      classifications: ['実写', 'カメラワーク', 'AIモデル'],
      aiModels: ['DALL-E 4'],
      isHot: true,
      likes: 678,
      comments: 92,
      views: 4567,
      createdAt: '2025-10-23T09:15:00Z',
      contest: 'halloween2025',
    },
    {
      id: 4,
      title: '幻想的な魔法陣',
      author: 'マジッククリエイター',
      authorAvatar: '/images/avatars/user4.jpg',
      thumbnail: '/images/samples/sample2.jpg',
      type: 'image',
      classifications: ['アニメ', 'AIモデル'],
      aiModels: ['Seedream'],
      isHot: false,
      likes: 345,
      comments: 56,
      views: 2345,
      createdAt: '2025-10-22T16:45:00Z',
      contest: 'halloween2025',
    },
    {
      id: 5,
      title: 'ホラー映画のようなシーン',
      author: 'ムービーメーカー',
      authorAvatar: '/images/avatars/user5.jpg',
      thumbnail: '/images/samples/sample5.jpg',
      type: 'video',
      classifications: ['実写', 'カメラワーク', 'ワークフロー', 'AIモデル'],
      aiModels: ['Sora2', 'Claude 4'],
      isHot: true,
      likes: 789,
      comments: 123,
      views: 5678,
      createdAt: '2025-10-21T11:20:00Z',
      contest: 'halloween2025',
    },
    {
      id: 6,
      title: '漫画風のハロウィンキャラ',
      author: 'マンガアーティスト',
      authorAvatar: '/images/avatars/user6.jpg',
      thumbnail: '/images/samples/sample6.jpg',
      type: 'image',
      classifications: ['漫画', 'AIモデル'],
      aiModels: ['Midjourney v7'],
      isHot: false,
      likes: 456,
      comments: 67,
      views: 2987,
      createdAt: '2025-10-20T13:30:00Z',
      contest: 'halloween2025',
    },
    {
      id: 7,
      title: 'スチームパンクなハロウィン',
      author: 'スチームパンカー',
      authorAvatar: '/images/avatars/user1.jpg',
      thumbnail: '/images/samples/sample7.jpg',
      type: 'image',
      classifications: ['実写', 'カメラワーク', 'AIモデル'],
      aiModels: ['DALL-E 4', 'GPT-5'],
      isHot: false,
      likes: 567,
      comments: 89,
      views: 3456,
      createdAt: '2025-10-19T15:00:00Z',
      contest: 'halloween2025',
    },
    {
      id: 8,
      title: 'ダンスパーティーの動画',
      author: 'アニメーター',
      authorAvatar: '/images/avatars/user2.jpg',
      thumbnail: '/images/samples/sample8.jpg',
      type: 'video',
      classifications: ['アニメ', 'ワークフロー', 'AIモデル'],
      aiModels: ['Seedance', 'Omnihuman'],
      isHot: true,
      likes: 890,
      comments: 134,
      views: 6789,
      createdAt: '2025-10-18T10:45:00Z',
      contest: 'halloween2025',
    },
  ];

  const handleClassificationChange = (classification: Classification | 'all') => {
    setActiveClassification(classification);
    if (classification !== 'AIモデル') {
      setSelectedAIModel('all');
      setShowAIModelDropdown(false);
    } else {
      setShowAIModelDropdown(true);
    }
  };

  const handleAIModelChange = (model: AIModel | 'all') => {
    setSelectedAIModel(model);
  };

  const filteredPosts = contestPosts.filter((post) => {
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
    return classificationMatch;
  });

  const displayedPosts = filteredPosts.slice(0, 8);

  return (
    <div className="flex bg-gray-950 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <section className="relative h-[400px] bg-gradient-to-r from-orange-900 via-purple-900 to-gray-900">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">ハロウィン創作カップ2025</div>
              <h1 className="text-5xl font-bold mb-4">🎃 Halloween Creation Cup 2025</h1>
              <p className="text-xl text-gray-200 mb-6">あなたの創造力で最高のハロウィン作品を作ろう！</p>
              <div className="flex gap-4">
                <Link href="/contest/halloween2025" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  <Trophy size={20} />
                  コンテスト詳細
                </Link>
                <Link href="/guides" className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  <BookOpen size={20} />
                  攻略を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">開催中のコンテスト</h2>
            <Link href="/contests" className="text-red-400 hover:text-red-300 flex items-center gap-2">すべて見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/contest/halloween2025" className="bg-gradient-to-br from-orange-900/50 to-purple-900/50 rounded-xl overflow-hidden hover:scale-105 transition border border-orange-800/50">
              <div className="aspect-video relative">
                <Image src="/images/banners/halloween2025.jpg" alt="ハロウィン創作カップ2025" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">開催中</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ハロウィン創作カップ2025</h3>
                <p className="text-gray-400 text-sm mb-4">締切: 2025年11月1日</p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Trophy size={16} className="text-yellow-400" />
                  <span>賞金総額: ¥500,000</span>
                </div>
              </div>
            </Link>
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 opacity-50">
              <div className="aspect-video bg-gray-700 flex items-center justify-center"><span className="text-gray-500">Coming Soon</span></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">次回コンテスト</h3>
                <p className="text-gray-400 text-sm">お楽しみに！</p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 opacity-50">
              <div className="aspect-video bg-gray-700 flex items-center justify-center"><span className="text-gray-500">Coming Soon</span></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">次回コンテスト</h3>
                <p className="text-gray-400 text-sm">お楽しみに！</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-6"><Sparkles className="text-purple-400" size={28} /><h2 className="text-3xl font-bold">AI生成を始める</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/create/text-to-image" className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/50 hover:border-blue-600/50 transition group">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">テキストから画像生成</h3>
              <p className="text-gray-400 text-sm mb-4">プロンプトから高品質な画像を生成します</p>
              <div className="text-xs text-gray-500">Seedream / Seedance / Dreamina</div>
            </Link>
            <Link href="/create/image-to-video" className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-800/50 hover:border-purple-600/50 transition group">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">画像から動画生成</h3>
              <p className="text-gray-400 text-sm mb-4">静止画を魅力的なアニメーションに変換</p>
              <div className="text-xs text-gray-500">Seedream / Omnihuman</div>
            </Link>
            <Link href="/create/text-to-music" className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-800/50 hover:border-green-600/50 transition group">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition">テキストから音楽生成</h3>
              <p className="text-gray-400 text-sm mb-4">プロンプトからオリジナル楽曲を作成</p>
              <div className="text-xs text-gray-500">Hotgen General</div>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3"><Trophy className="text-yellow-400" />コンテスト投稿作品</h2>
            <Link href="/contest-posts" className="text-red-400 hover:text-red-300 flex items-center gap-2">すべて見る →</Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
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
            <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3"><Cpu size={20} className="text-cyan-400" /><span className="font-semibold">モデルで絞り込み</span></div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleAIModelChange('all')} className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${selectedAIModel === 'all' ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>すべてのモデル</button>
                {aiModelOptions.map((model) => (
                  <button key={model} onClick={() => handleAIModelChange(model)} className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${selectedAIModel === model ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>{model}</button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedPosts.map((post) => (
              <Link key={post.id} href={`/contest-posts/${post.id}`} className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition">
                <div className="aspect-square relative">
                  <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
                  {post.isHot && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Flame size={12} className="animate-pulse" />
                      HOT
                    </div>
                  )}
                  {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="text-white" size={40} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-semibold mb-2">{post.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <span className="flex items-center gap-1"><ThumbsUp size={12} />{post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={12} />{post.comments}</span>
                        <span className="flex items-center gap-1"><Eye size={12} />{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {displayedPosts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>該当する投稿が見つかりませんでした。</p>
              <p className="text-sm mt-2">別のタブを選択してみてください。</p>
            </div>
          )}
        </section>

        <section className="container mx-auto px-6 py-12 border-t border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-6">おすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/guides" className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-800/50 hover:border-cyan-600/50 transition">
              <BookOpen className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">攻略・使い方</h3>
              <p className="text-gray-400 text-sm">プロンプトのコツや優秀作品の分析をチェック</p>
            </Link>
            <Link href="/contest/halloween2025/vote" className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-800/50 hover:border-yellow-600/50 transition">
              <Trophy className="text-yellow-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">作品に投票する</h3>
              <p className="text-gray-400 text-sm">素晴らしい作品にいいねして応援しよう</p>
            </Link>
            <Link href="/contest/halloween2025/submit" className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-800/50 hover:border-red-600/50 transition">
              <Sparkles className="text-red-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">コンテストに応募</h3>
              <p className="text-gray-400 text-sm">あなたの作品を世界に発信しよう</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}


