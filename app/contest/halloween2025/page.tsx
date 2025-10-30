'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Trophy,
  Users,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Heart,
  Upload,
  Clock,
} from 'lucide-react';

export default function HalloweenContestPage() {
  const { isLoggedIn } = useAuth();

  const prizes = [
    {
      rank: '最優秀賞',
      prize: '¥200,000',
      icon: '👑',
      color: 'from-yellow-600 to-orange-600',
    },
    {
      rank: '優秀賞',
      prize: '¥100,000',
      icon: '🥈',
      color: 'from-gray-400 to-gray-600',
    },
    {
      rank: '特別賞',
      prize: '¥50,000',
      icon: '🥉',
      color: 'from-orange-600 to-red-600',
    },
  ];

  const categories = [
    '最優秀ハロウィン雰囲気賞',
    '最優秀キャラクター賞',
    '最優秀アニメーション賞',
    '最優秀ホラー演出賞',
    '観客賞（最多得票）',
  ];

  const rules = [
    'オリジナル作品であり、著作権侵害に当たらないもの、未発表の新作であるもの。',
    '作品の少なくとも70%がAnimeHubで作成されていること。',
    '使用可能なモデル：Seedream / Seedance / Dreamina / Omnihuman / Hotgen General。',
    '動画の長さは、10秒から5分の間でなければなりません。',
    '音声はオリジナルまたはライセンス取得済みであること',
    'ポルノ、過度の暴力、または虚偽誤認のホラーコンテンツの応募は禁止とします。',
  ];

  const timeline = [
    { date: '10月1日', event: 'コンテスト開始・作品応募受付開始', status: 'completed' },
    { date: '10月25日', event: '応募締切', status: 'completed' },
    { date: '10月26日 - 10月31日', event: '一般投票期間', status: 'active' },
    { date: '11月1日', event: '結果発表', status: 'upcoming' },
  ];

  // 応募中の作品（モック）
  const currentSubmissions = [
    { id: 1, imageUrl: '/images/samples/sample1.jpg', title: 'おばけハロウィン' },
    { id: 2, imageUrl: '/images/samples/sample2.jpg', title: '魔女の宅配便' },
    { id: 3, imageUrl: '/images/samples/sample3.jpg', title: 'パンプキンナイト' },
    { id: 4, imageUrl: '/images/samples/sample5.jpg', title: '満月の海賊船' },
    { id: 5, imageUrl: '/images/samples/sample7.jpg', title: 'スチームパンクハロウィン' },
    { id: 6, imageUrl: '/images/samples/sample8.jpg', title: 'ダンスパーティー' },
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-purple-900 to-gray-900">
          <div className="absolute inset-0 opacity-20">
            {/* ハロウィン装飾の背景画像 */}
            <Image
              src="/images/contests/halloween-bg.jpg"
              alt="Halloween Background"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          <div className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold mb-6 animate-pulse">
            🎃 Halloween Creation Cup 2025 🎃
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
            Halloween Creation Cup 2025
          </h1>
          
          <p className="text-2xl text-gray-200 mb-8 max-w-3xl">
            AIの力で最高のハロウィン作品を創造しよう！<br />
            総額50万円の賞金をかけた創作コンテスト
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <Link
                  href="/contest/halloween2025/vote"
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2"
                >
                  <Heart size={24} />
                  作品に投票する
                </Link>
                <Link
                  href="/contest/halloween2025/submit"
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2"
                >
                  <Upload size={24} />
                  作品を応募する
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg font-bold text-lg transition flex items-center gap-2"
              >
                ログインして参加する
                <ArrowRight size={24} />
              </Link>
            )}
          </div>

          {/* 統計情報 */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Trophy className="text-yellow-400 mb-2 mx-auto" size={32} />
              <div className="text-3xl font-bold">¥500,000</div>
              <div className="text-gray-300">総賞金額</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Users className="text-purple-400 mb-2 mx-auto" size={32} />
              <div className="text-3xl font-bold">1,234</div>
              <div className="text-gray-300">応募作品数</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <Heart className="text-red-400 mb-2 mx-auto" size={32} />
              <div className="text-3xl font-bold">12,345</div>
              <div className="text-gray-300">総投票数</div>
            </div>
          </div>
        </div>
      </section>

      {/* タイムライン */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
          <Clock className="text-purple-400" />
          スケジュール
        </h2>
        
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, index) => (
            <div key={index} className="flex gap-6 mb-8 relative">
              {/* タイムラインの線 */}
              {index !== timeline.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-700" />
              )}
              
              {/* アイコン */}
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                    item.status === 'completed'
                      ? 'bg-green-600'
                      : item.status === 'active'
                      ? 'bg-purple-600 animate-pulse'
                      : 'bg-gray-700'
                  }`}
                >
                  {item.status === 'completed' && <CheckCircle size={16} />}
                  {item.status === 'active' && <Clock size={16} />}
                </div>
              </div>
              
              {/* コンテンツ */}
              <div className="flex-1 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="font-bold text-lg mb-2">{item.date}</div>
                <div className="text-gray-300">{item.event}</div>
                {item.status === 'active' && (
                  <div className="mt-2 inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    開催中
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 賞金・賞の情報 */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-b from-transparent to-purple-900/20">
        <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
          <Trophy className="text-yellow-400" />
          賞金と賞
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${prize.color} rounded-xl p-8 text-center transform hover:scale-105 transition`}
            >
              <div className="text-6xl mb-4">{prize.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{prize.rank}</h3>
              <div className="text-4xl font-bold">{prize.prize}</div>
            </div>
          ))}
        </div>

        {/* カテゴリー賞 */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">特別カテゴリー賞</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 border border-purple-700/50 flex items-center gap-3"
              >
                <Sparkles className="text-purple-400 flex-shrink-0" size={24} />
                <span className="font-semibold">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 作品投稿規定 */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">作品投稿規定</h2>
        
        <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-xl p-8 border border-gray-700">
          <ul className="space-y-4">
            {rules.map((rule, index) => (
              <li key={index} className="flex gap-4">
                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-300">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 応募中の作品グリッド */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-b from-transparent to-gray-900/50">
        <h2 className="text-4xl font-bold text-center mb-12">応募中の作品</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentSubmissions.map((item) => (
            <div
              key={item.id}
              className="aspect-square rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition cursor-pointer relative group"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <p className="text-sm font-semibold truncate w-full">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA セクション */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 rounded-2xl p-12 text-center border border-red-800/50">
          <h2 className="text-4xl font-bold mb-6">
            準備はできましたか？
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            あなたの創造力を世界に発信しましょう！
          </p>
          
          {isLoggedIn ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contest/halloween2025/submit"
                className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-lg font-bold text-lg transition inline-flex items-center gap-2"
              >
                <Upload size={24} />
                作品を応募する
              </Link>
              <Link
                href="/contest/halloween2025/vote"
                className="bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-lg font-bold text-lg transition inline-flex items-center gap-2"
              >
                <Heart size={24} />
                作品に投票する
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-lg font-bold text-lg transition inline-flex items-center gap-2"
            >
              ログインして参加する
              <ArrowRight size={24} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

