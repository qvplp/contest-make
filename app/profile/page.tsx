'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Edit,
  Twitter,
  Instagram,
  Globe,
  Trophy,
  BookOpen,
  Image as ImageIcon,
  Bell,
  ThumbsUp,
  MessageCircle,
  Eye,
  Play,
  Flame,
  Check,
} from 'lucide-react';

interface Badge {
  id: number;
  type: 'gold' | 'silver' | 'bronze' | 'special';
  contest: string;
  rank: number;
  year: number;
  icon: string;
}

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'contest' | 'follow' | 'system';
  title: string;
  message: string;
  icon: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface UserGuide {
  id: number;
  title: string;
  thumbnail: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

interface UserPost {
  id: number;
  title: string;
  thumbnail: string;
  type: 'image' | 'video';
  isHot: boolean;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'guides' | 'posts' | 'notifications'>('guides');

  const userProfile = {
    id: '1',
    username: 'AIマスター',
    userId: 'ai_master',
    avatar: '/images/avatars/user1.jpg',
    bio: 'AIアートを愛するクリエイター。Seedream、Midjourney、DALL-Eを使って幻想的な世界を創造しています。コンテストで数々の賞を受賞。初心者の方へのアドバイスも歓迎です！',
    credits: 92,
    social: {
      twitter: 'https://twitter.com/ai_master',
      instagram: 'https://instagram.com/ai_master',
      portfolio: 'https://ai-master-portfolio.com',
    },
    stats: {
      guidesCount: 12,
      postsCount: 24,
      followersCount: 156,
      followingCount: 89,
    },
  };

  const badges: Badge[] = [
    { id: 1, type: 'gold', contest: 'ハロウィンカップ', rank: 1, year: 2025, icon: '🥇' },
    { id: 2, type: 'silver', contest: 'サマーカップ', rank: 2, year: 2024, icon: '🥈' },
    { id: 3, type: 'bronze', contest: 'ウィンターカップ', rank: 3, year: 2025, icon: '🥉' },
    { id: 4, type: 'special', contest: '新人賞', rank: 0, year: 2024, icon: '🎖️' },
  ];

  const badgeStyles = {
    gold: 'from-yellow-400 to-yellow-600 text-black',
    silver: 'from-gray-300 to-gray-500 text-black',
    bronze: 'from-orange-500 to-orange-700 text-white',
    special: 'from-purple-500 to-pink-500 text-white',
  } as const;

  const userGuides: UserGuide[] = [
    { id: 1, title: 'ハロウィン雰囲気を出すプロンプトテクニック10選', thumbnail: '/images/samples/sample1.jpg', likes: 342, comments: 45, views: 2345, createdAt: '2025-10-20T10:00:00Z' },
    { id: 2, title: 'Seedreamで幽霊を描く方法', thumbnail: '/images/samples/sample2.jpg', likes: 278, comments: 32, views: 1876, createdAt: '2025-10-19T14:30:00Z' },
    { id: 3, title: 'アニメーションの基礎講座', thumbnail: '/images/samples/sample3.jpg', likes: 189, comments: 28, views: 1543, createdAt: '2025-10-18T09:15:00Z' },
    { id: 4, title: 'カメラアングルの使い分け', thumbnail: '/images/samples/sample4.jpg', likes: 156, comments: 22, views: 1234, createdAt: '2025-10-17T16:45:00Z' },
  ];

  const userPosts: UserPost[] = [
    { id: 1, title: 'ハロウィンの魔女', thumbnail: '/images/samples/sample1.jpg', type: 'image', isHot: true, likes: 542, comments: 78, views: 3456, createdAt: '2025-10-25T10:00:00Z' },
    { id: 2, title: 'ダンスするかぼちゃ', thumbnail: '/images/samples/sample3.jpg', type: 'video', isHot: false, likes: 234, comments: 45, views: 1876, createdAt: '2025-10-24T14:30:00Z' },
    { id: 3, title: 'リアルなお化け屋敷', thumbnail: '/images/samples/sample4.jpg', type: 'image', isHot: true, likes: 678, comments: 92, views: 4567, createdAt: '2025-10-23T09:15:00Z' },
    { id: 4, title: '幻想的な魔法陣', thumbnail: '/images/samples/sample2.jpg', type: 'image', isHot: false, likes: 345, comments: 56, views: 2345, createdAt: '2025-10-22T16:45:00Z' },
    { id: 5, title: 'ホラー映画のようなシーン', thumbnail: '/images/samples/sample5.jpg', type: 'video', isHot: true, likes: 789, comments: 123, views: 5678, createdAt: '2025-10-21T11:20:00Z' },
    { id: 6, title: '漫画風のハロウィンキャラ', thumbnail: '/images/samples/sample6.jpg', type: 'image', isHot: false, likes: 456, comments: 67, views: 2987, createdAt: '2025-10-20T13:30:00Z' },
  ];

  const notifications: Notification[] = [
    { id: 1, type: 'like', title: 'いいねを獲得しました', message: 'あなたの作品「ハロウィンの魔女」が100いいねを獲得しました', icon: '🔥', isRead: false, createdAt: '2025-10-31T08:00:00Z', link: '/contest-posts/1' },
    { id: 2, type: 'comment', title: '新しいコメント', message: '「幽霊の描き方」に新しいコメントがつきました', icon: '💬', isRead: false, createdAt: '2025-10-31T05:00:00Z', link: '/guides/2' },
    { id: 3, type: 'contest', title: 'コンテスト結果発表', message: 'ハロウィンカップ2025の結果が発表されました', icon: '🏆', isRead: false, createdAt: '2025-10-30T10:00:00Z', link: '/contest/halloween2025' },
    { id: 4, type: 'follow', title: '新しいフォロワー', message: '@AIクリエイター があなたをフォローしました', icon: '👤', isRead: true, createdAt: '2025-10-29T15:30:00Z', link: '/user/2' },
    { id: 5, type: 'system', title: 'システム通知', message: 'クレジットの有効期限が近づいています', icon: '📢', isRead: true, createdAt: '2025-10-28T09:00:00Z', link: '/settings/payment' },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return '1時間前';
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays === 1) return '1日前';
    return `${diffDays}日前`;
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">マイページ</h1>
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition text-sm sm:text-base">
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-purple-600">
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.username}
                  fill
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{userProfile.username}</h2>
                  <p className="text-sm sm:text-base text-gray-400 mb-2">@{userProfile.userId}</p>
                </div>
                <Link href="/profile/edit" className="bg-purple-600 hover:bg-purple-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center gap-2 whitespace-nowrap justify-center md:justify-start">
                  <Edit size={18} className="sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">プロフィールを編集</span>
                </Link>
              </div>

              <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">{userProfile.bio}</p>

              <div className="flex gap-4 mb-4">
                {userProfile.social.twitter && (
                  <a href={userProfile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                    <Twitter size={24} />
                  </a>
                )}
                {userProfile.social.instagram && (
                  <a href={userProfile.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition">
                    <Instagram size={24} />
                  </a>
                )}
                {userProfile.social.portfolio && (
                  <a href={userProfile.social.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition">
                    <Globe size={24} />
                  </a>
                )}
              </div>

              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold">{userProfile.stats.followersCount}</span>
                  <span className="text-gray-400 ml-1">フォロワー</span>
                </div>
                <div>
                  <span className="font-semibold">{userProfile.stats.followingCount}</span>
                  <span className="text-gray-400 ml-1">フォロー中</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {badges.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-800">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-400" size={24} />
              受賞履歴
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {badges.map((badge) => (
                <Link key={badge.id} href={`/contests/${badge.contest.toLowerCase().replace(/\s+/g, '-')}`} className={`bg-gradient-to-br ${badgeStyles[badge.type]} rounded-xl p-3 sm:p-4 lg:p-6 text-center hover:scale-105 transition`}>
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2">{badge.icon}</div>
                  <div className="font-bold text-xs sm:text-sm lg:text-base mb-1">{badge.contest}</div>
                  <div className="text-xs sm:text-sm">{badge.rank > 0 ? `${badge.rank}位` : ''}</div>
                  <div className="text-xs sm:text-sm opacity-80">{badge.year}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button onClick={() => setActiveTab('guides')} className={`flex items-center gap-2 px-6 py-3 font-semibold transition relative ${activeTab === 'guides' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
            <BookOpen size={20} />
            攻略記事 ({userProfile.stats.guidesCount})
            {activeTab === 'guides' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
          <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 px-6 py-3 font-semibold transition relative ${activeTab === 'posts' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
            <ImageIcon size={20} />
            投稿作品 ({userProfile.stats.postsCount})
            {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-2 px-6 py-3 font-semibold transition relative ${activeTab === 'notifications' ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
            <Bell size={20} />
            通知
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
            {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
          </button>
        </div>

        {activeTab === 'guides' && (
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">投稿した攻略記事 ({userGuides.length}件)</h3>
            {userGuides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {userGuides.map((guide) => (
                  <Link key={guide.id} href={`/guides/${guide.id}`} className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-purple-600 transition border border-gray-800 group">
                    <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-800">
                      <Image
                        src={guide.thumbnail}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h4 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-400 transition">{guide.title}</h4>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                        <span className="flex items-center gap-1"><ThumbsUp size={14} />{guide.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={14} />{guide.comments}</span>
                        <span className="flex items-center gap-1"><Eye size={14} />{guide.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>まだ攻略記事を投稿していません</p>
                <Link href="/guides/new" className="inline-block mt-4 text-purple-400 hover:text-purple-300">最初の記事を投稿する →</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">投稿した作品 ({userPosts.length}件)</h3>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {userPosts.map((post) => (
                  <Link key={post.id} href={`/contest-posts/${post.id}`} className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-800 hover:scale-105 transition">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                      {post.isHot && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded text-xs font-bold flex items-center gap-1">
                          <Flame size={12} />
                          HOT
                        </div>
                      )}
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="text-white" fill="white" size={20} />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <ThumbsUp size={14} />
                          {post.likes}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>まだ作品を投稿していません</p>
                <Link href="/contest/halloween2025/submit" className="inline-block mt-4 text-purple-400 hover:text-purple-300">最初の作品を投稿する →</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">通知 ({unreadCount}件の未読)</h3>
              {unreadCount > 0 && (
                <button className="text-purple-400 hover:text-purple-300 transition flex items-center gap-2 text-sm sm:text-base">
                  <Check size={18} />
                  <span className="hidden sm:inline">すべて既読にする</span>
                </button>
              )}
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Link key={notification.id} href={notification.link || '#'} className={`block rounded-xl p-4 transition ${notification.isRead ? 'bg-gray-900 border border-gray-800' : 'bg-purple-900/30 border border-purple-700/50'}`}>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{notification.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {!notification.isRead && (
                            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">未読</span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Bell size={48} className="mx-auto mb-4 opacity-50" />
                <p>通知はありません</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


