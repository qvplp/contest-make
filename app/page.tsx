'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Trophy, BookOpen, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 未ログインの場合はログイン画面へリダイレクト
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  // サンプルの生成画像データ
  const generatedImages = [
    { id: 1, src: '/images/samples/sample1.jpg', title: 'ハロウィンの夜', type: 'image' },
    { id: 2, src: '/images/samples/sample2.jpg', title: 'かぼちゃのランタン', type: 'image' },
    { id: 3, src: '/images/samples/sample3.jpg', title: '魔女の宅配', type: 'video' },
    { id: 4, src: '/images/samples/sample4.jpg', title: 'お化け屋敷', type: 'image' },
    { id: 5, src: '/images/samples/sample5.jpg', title: '満月の海賊船', type: 'video' },
    { id: 6, src: '/images/samples/sample6.jpg', title: 'モダンハロウィン', type: 'image' },
    { id: 7, src: '/images/samples/sample7.jpg', title: 'スチームパンクハロウィン', type: 'image' },
    { id: 8, src: '/images/samples/sample8.jpg', title: 'ダンスパーティー', type: 'video' },
  ];

  return (
    <div className="flex bg-gray-950 min-h-screen">
      {/* サイドバー */}
      <Sidebar />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">
        {/* ヒーローバナー */}
        <section className="relative h-[400px] bg-gradient-to-r from-orange-900 via-purple-900 to-gray-900">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-6 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                ハロウィン創作カップ2025
              </div>
              <h1 className="text-5xl font-bold mb-4">
                🎃 Halloween Creation Cup 2025
              </h1>
              <p className="text-xl text-gray-200 mb-6">
                あなたの創造力で最高のハロウィン作品を作ろう！
              </p>
              <div className="flex gap-4">
                <Link
                  href="/contest/halloween2025"
                  className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Trophy size={20} />
                  コンテスト詳細
                </Link>
                <Link
                  href="/guides"
                  className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  攻略を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 開催中のコンテスト */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">開催中のコンテスト</h2>
            <Link
              href="/contests"
              className="text-red-400 hover:text-red-300 flex items-center gap-2"
            >
              すべて見る →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* コンテストカード1 */}
            <Link
              href="/contest/halloween2025"
              className="bg-gradient-to-br from-orange-900/50 to-purple-900/50 rounded-xl overflow-hidden hover:scale-105 transition border border-orange-800/50"
            >
              <div className="aspect-video relative">
                <Image
                  src="/images/banners/halloween2025.jpg"
                  alt="ハロウィン創作カップ2025"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  開催中
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">ハロウィン創作カップ2025</h3>
                <p className="text-gray-400 text-sm mb-4">
                  締切: 2025年11月1日
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Trophy size={16} className="text-yellow-400" />
                  <span>賞金総額: ¥500,000</span>
                </div>
              </div>
            </Link>

            {/* その他のコンテストカード（プレースホルダー） */}
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 opacity-50">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500">Coming Soon</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">次回コンテスト</h3>
                <p className="text-gray-400 text-sm">
                  お楽しみに！
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 opacity-50">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500">Coming Soon</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">次回コンテスト</h3>
                <p className="text-gray-400 text-sm">
                  お楽しみに！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 生成モデル選択 */}
        <section className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-purple-400" size={28} />
            <h2 className="text-3xl font-bold">AI生成を始める</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* テキストから画像生成 */}
            <Link
              href="/create/text-to-image"
              className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-800/50 hover:border-blue-600/50 transition group"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">
                テキストから画像生成
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                プロンプトから高品質な画像を生成します
              </p>
              <div className="text-xs text-gray-500">
                Seedream / Seedance / Dreamina
              </div>
            </Link>

            {/* 画像から動画生成 */}
            <Link
              href="/create/image-to-video"
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-800/50 hover:border-purple-600/50 transition group"
            >
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition">
                画像から動画生成
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                静止画を魅力的なアニメーションに変換
              </p>
              <div className="text-xs text-gray-500">
                Seedream / Omnihuman
              </div>
            </Link>

            {/* テキストから音楽生成 */}
            <Link
              href="/create/text-to-music"
              className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-800/50 hover:border-green-600/50 transition group"
            >
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition">
                テキストから音楽生成
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                プロンプトからオリジナル楽曲を作成
              </p>
              <div className="text-xs text-gray-500">
                Hotgen General
              </div>
            </Link>
          </div>
        </section>

        {/* あなたの生成物 */}
        <section className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">あなたの生成物</h2>
            <Link
              href="/library"
              className="text-red-400 hover:text-red-300 flex items-center gap-2"
            >
              すべて見る →
            </Link>
          </div>

          {/* マソンリーレイアウト風タイル */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                  {image.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="text-white" size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-sm font-semibold">{image.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* おすすめコンテンツ */}
        <section className="container mx-auto px-6 py-12 border-t border-gray-800 mb-12">
          <h2 className="text-3xl font-bold mb-6">おすすめ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 攻略記事 */}
            <Link
              href="/guides"
              className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-800/50 hover:border-cyan-600/50 transition"
            >
              <BookOpen className="text-cyan-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">攻略・使い方</h3>
              <p className="text-gray-400 text-sm">
                プロンプトのコツや優秀作品の分析をチェック
              </p>
            </Link>

            {/* コンテスト投票 */}
            <Link
              href="/contest/halloween2025/vote"
              className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-800/50 hover:border-yellow-600/50 transition"
            >
              <Trophy className="text-yellow-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">作品に投票する</h3>
              <p className="text-gray-400 text-sm">
                素晴らしい作品にいいねして応援しよう
              </p>
            </Link>

            {/* コンテスト応募 */}
            <Link
              href="/contest/halloween2025/submit"
              className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-6 border border-red-800/50 hover:border-red-600/50 transition"
            >
              <Sparkles className="text-red-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">コンテストに応募</h3>
              <p className="text-gray-400 text-sm">
                あなたの作品を世界に発信しよう
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
