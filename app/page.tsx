'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ResponsiveImage from '@/components/ResponsiveImage';
import { 
  Play, 
  ThumbsUp, 
  Eye, 
  Flame, 
  Trophy,
  Lightbulb,
  BookOpen,
  Clock,
  MessageCircle,
} from 'lucide-react';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeContestTab, setActiveContestTab] = useState('all');

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

  // ヒーロースライドデータ
  const heroSlides = [
    {
      id: 1,
      type: 'image' as const,
      src: '/images/banners/halloween2025.jpg',
      title: 'AI動画生成の\n新時代へ',
      description: '誰でも簡単に、プロ級のアニメーションを作成できます',
      ctaText: '今すぐ始める',
      ctaLink: '/create',
    },
    {
      id: 2,
      type: 'image' as const,
      src: '/images/banners/halloween2025.jpg',
      title: 'コンテスト\n開催中',
      description: 'ハロウィンカップ2025に参加して、豪華賞品をゲット',
      ctaText: 'コンテストを見る',
      ctaLink: '/contest/halloween2025',
    },
    {
      id: 3,
      type: 'image' as const,
      src: '/images/banners/halloween2025.jpg',
      title: '攻略ガイドで\nスキルアップ',
      description: 'プロのテクニックを学んで、作品をレベルアップ',
      ctaText: '攻略を見る',
      ctaLink: '/guides',
    },
  ];

  // コンテスト投稿作品データ
  const contestPosts = [
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
    {
      id: 9,
      thumbnail: '/images/samples/sample1.jpg',
      title: 'かわいいおばけ',
      type: 'image' as const,
      likes: 678,
      views: 2345,
      isHot: false,
    },
    {
      id: 10,
      thumbnail: '/images/samples/sample2.jpg',
      title: '魔法のパーティー',
      type: 'video' as const,
      likes: 1456,
      views: 5678,
      isHot: true,
    },
  ];

  // 人気攻略記事データ
  const popularGuides = [
    {
      id: 1,
      thumbnail: '/images/samples/sample3.jpg',
      title: 'Sora2で作る映画的なアニメーション',
      excerpt: 'プロレベルのアニメーションを作成するための完全ガイド',
      author: {
        name: 'AIマスター',
        avatar: '/images/avatars/user1.jpg',
      },
      likes: 1234,
      comments: 89,
      readTime: 15,
    },
    {
      id: 2,
      thumbnail: '/images/samples/sample4.jpg',
      title: 'Seedreamを使ったキャラクター作成のコツ',
      excerpt: '魅力的なキャラクターを生み出すプロンプトテクニック',
      author: {
        name: 'クリエイター',
        avatar: '/images/avatars/user2.jpg',
      },
      likes: 890,
      comments: 56,
      readTime: 12,
    },
    {
      id: 3,
      thumbnail: '/images/samples/sample5.jpg',
      title: 'カメラワークで動画をレベルアップ',
      excerpt: '映画的で印象的なシーンを作るカメラワークの基本',
      author: {
        name: 'ビデオエキスパート',
        avatar: '/images/avatars/user3.jpg',
      },
      likes: 1567,
      comments: 123,
      readTime: 18,
    },
    {
      id: 4,
      thumbnail: '/images/samples/sample6.jpg',
      title: 'ワークフロー最適化ガイド',
      excerpt: '効率的な制作フローで時間を節約して質を向上',
      author: {
        name: 'プロデューサー',
        avatar: '/images/avatars/user4.jpg',
      },
      likes: 2345,
      comments: 178,
      readTime: 20,
    },
  ];

  // フィルターされた投稿
  const filteredPosts = activeContestTab === 'hot' 
    ? contestPosts.filter(post => post.isHot)
    : activeContestTab === 'new'
    ? contestPosts.slice(0, 8)
    : contestPosts;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ヒーローセクション */}
      <HeroSlider slides={heroSlides} autoPlayInterval={10000} />

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 min-[480px]:px-6 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        
        {/* コンテスト投稿作品セクション */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                🎨 コンテスト投稿作品
              </h2>
              <p className="text-sm min-[480px]:text-base text-gray-400">
                コミュニティの素晴らしい作品をチェック
              </p>
            </div>
            <Link
              href="/contest-posts"
              className="text-sm min-[480px]:text-base sm:text-lg text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap"
            >
              すべて見る →
            </Link>
          </div>

          {/* タブナビゲーション */}
          <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto scrollbar-hide pb-2">
            {['all', 'hot', 'new', 'popular'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveContestTab(tab)}
                className={`flex-shrink-0 px-4 min-[480px]:px-5 sm:px-6 py-2 min-[480px]:py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm min-[480px]:text-base whitespace-nowrap ${
                  activeContestTab === tab
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
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/contest-posts/${post.id}`}>
                <div className="relative group cursor-pointer">
                  <ResponsiveImage
                    src={post.thumbnail}
                    alt={post.title}
                    aspectRatio="1/1"
                    sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    className="group-hover:ring-2 group-hover:ring-purple-600"
                    overlayContent={
                      <>
                        {post.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 min-[480px]:w-12 min-[480px]:h-12 sm:w-14 sm:h-14 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/90 transition-colors">
                              <Play className="text-white" fill="white" size={20} />
                            </div>
                          </div>
                        )}
                        {post.isHot && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-600 to-red-600 rounded text-xs font-bold flex items-center gap-1">
                            <Flame size={12} />
                            HOT
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                            <h3 className="text-white font-semibold text-xs min-[480px]:text-sm mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-300">
                              <span className="flex items-center gap-1">
                                <ThumbsUp size={12} />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {post.views}
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

        {/* 人気攻略記事セクション */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                💡 人気の攻略記事
              </h2>
              <p className="text-sm min-[480px]:text-base text-gray-400">
                プロのテクニックを学ぼう
              </p>
            </div>
            <Link
              href="/guides"
              className="text-sm min-[480px]:text-base sm:text-lg text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap"
            >
              すべて見る →
            </Link>
          </div>

          {/* 攻略記事グリッド */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {popularGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.id}`}>
                <article className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-600 transition-all group h-full flex flex-col">
                  <ResponsiveImage
                    src={guide.thumbnail}
                    alt={guide.title}
                    aspectRatio="16/9"
                    sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="p-3 min-[480px]:p-4 sm:p-4 lg:p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-sm min-[480px]:text-base sm:text-base lg:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs min-[480px]:text-sm text-gray-400 line-clamp-2 mb-3 sm:mb-4 flex-1">
                      {guide.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs min-[480px]:text-sm text-gray-400 pt-3 sm:pt-4 border-t border-gray-700">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        {guide.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {guide.readTime}分
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 sm:p-12 lg:p-16 text-center border border-purple-500/30">
          <h2 className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-base min-[480px]:text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            AI動画生成の世界へようこそ。あなたの創造性を解き放ち、素晴らしい作品を作りましょう。
          </p>
          <Link href="/contest/halloween2025/submit">
            <button className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
              無料で始める
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}