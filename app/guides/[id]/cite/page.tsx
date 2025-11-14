'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Link2,
  Play,
  Image as ImageIcon,
  ArrowLeft,
  ThumbsUp,
  Eye,
} from 'lucide-react';

interface UserPost {
  id: number;
  title: string;
  thumbnail: string;
  type: 'image' | 'video';
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export default function CiteGuidePage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id;
  const { isLoggedIn, user } = useAuth();

  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ログインチェック
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
  }, [isLoggedIn, router]);

  // ユーザーの作品を読み込む（プロフィールページと同じデータ構造を使用）
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    // モックデータ：実際の実装では、APIからユーザーの作品を取得
    // ここでは、プロフィールページと同じデータを使用
    // 重要なのは、user.idと一致する作品のみを表示すること（絶対に他人の作品は表示しない）
    // 実際の実装例：
    // const response = await fetch(`/api/users/${user.id}/posts`);
    // const posts = await response.json();
    // setUserPosts(posts.filter(post => post.authorId === user.id));
    const mockUserPosts: UserPost[] = [
      {
        id: 1,
        title: 'ハロウィンの魔女',
        thumbnail: '/images/samples/sample1.jpg',
        type: 'image',
        likes: 542,
        comments: 78,
        views: 3456,
        createdAt: '2025-10-25T10:00:00Z',
      },
      {
        id: 2,
        title: 'ダンスするかぼちゃ',
        thumbnail: '/images/samples/sample3.jpg',
        type: 'video',
        likes: 234,
        comments: 45,
        views: 1876,
        createdAt: '2025-10-24T14:30:00Z',
      },
      {
        id: 3,
        title: 'リアルなお化け屋敷',
        thumbnail: '/images/samples/sample4.jpg',
        type: 'image',
        likes: 678,
        comments: 92,
        views: 4567,
        createdAt: '2025-10-23T09:15:00Z',
      },
      {
        id: 4,
        title: '幻想的な魔法陣',
        thumbnail: '/images/samples/sample2.jpg',
        type: 'image',
        likes: 345,
        comments: 56,
        views: 2345,
        createdAt: '2025-10-22T16:45:00Z',
      },
      {
        id: 5,
        title: 'ホラー映画のようなシーン',
        thumbnail: '/images/samples/sample5.jpg',
        type: 'video',
        likes: 789,
        comments: 123,
        views: 5678,
        createdAt: '2025-10-21T11:20:00Z',
      },
      {
        id: 6,
        title: '漫画風のハロウィンキャラ',
        thumbnail: '/images/samples/sample6.jpg',
        type: 'image',
        likes: 456,
        comments: 67,
        views: 2987,
        createdAt: '2025-10-20T13:30:00Z',
      },
    ];

    // 実際の実装では、必ずuser.idでフィルタリングして、自分の作品のみを表示
    // ここでは、すべての作品が自分のものと仮定（モックデータ）
    // 本番環境では、以下のように厳密にフィルタリングする必要があります：
    // setUserPosts(mockUserPosts.filter(post => post.authorId === user.id));
    setUserPosts(mockUserPosts);
  }, [isLoggedIn, user]);

  const togglePostSelection = (postId: number) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCite = async () => {
    if (selectedPostIds.length === 0) {
      alert('引用する作品を選択してください');
      return;
    }

    setIsSubmitting(true);

    // 選択された作品の詳細情報を取得
    const selectedPosts = userPosts.filter((post) =>
      selectedPostIds.includes(post.id)
    );

    // 引用データを構築
    const citations = selectedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      thumbnail: post.thumbnail,
      type: post.type,
      author: user?.name || 'ユーザー',
      authorId: user?.id || '',
      likes: post.likes,
      views: post.views,
    }));

    // 既存の引用を読み込む
    const existingCitationsKey = `guide_citations_${guideId}`;
    const existingCitations = localStorage.getItem(existingCitationsKey);
    let allCitations = [];

    if (existingCitations) {
      try {
        allCitations = JSON.parse(existingCitations);
      } catch (e) {
        console.error('Failed to parse existing citations:', e);
      }
    }

    // 新しい引用を追加（重複を避ける）
    const existingIds = new Set(allCitations.map((c: any) => c.id));
    const newCitations = citations.filter((c) => !existingIds.has(c.id));
    allCitations = [...allCitations, ...newCitations];

    // localStorageに保存
    localStorage.setItem(existingCitationsKey, JSON.stringify(allCitations));

    // 少し待ってから記事ページに戻る
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/guides/${guideId}`);
    }, 1000);
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <Link
            href={`/guides/${guideId}`}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-4"
          >
            <ArrowLeft size={20} />
            記事に戻る
          </Link>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Link2 size={36} className="text-purple-400" />
            作品を引用する
          </h1>
          <p className="text-gray-400">
            記事を参考にして作成した作品を選択してください。複数の作品を選択できます。
          </p>
        </div>

        {userPosts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700 text-center">
            <ImageIcon size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 text-lg mb-2">投稿した作品がありません</p>
            <p className="text-gray-500 text-sm mb-4">
              まず作品を投稿してから、引用機能をご利用ください
            </p>
            <Link
              href="/contest/halloween2025/submit"
              className="inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              作品を投稿する
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                選択中: <span className="text-purple-400 font-semibold">{selectedPostIds.length}</span>件
              </p>
              {selectedPostIds.length > 0 && (
                <button
                  onClick={() => setSelectedPostIds([])}
                  className="text-gray-400 hover:text-white transition text-sm"
                >
                  選択をクリア
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userPosts.map((post) => {
                const isSelected = selectedPostIds.includes(post.id);
                return (
                  <div
                    key={post.id}
                    onClick={() => togglePostSelection(post.id)}
                    className={`relative bg-gray-800/50 rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-600/50'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* 選択チェックマーク */}
                    <div
                      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-900/80 text-gray-400'
                      }`}
                    >
                      {isSelected ? (
                        <Check size={20} />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-400 rounded" />
                      )}
                    </div>

                    <div className="relative aspect-square overflow-hidden bg-gray-800">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center">
                            <Play className="text-white" fill="white" size={24} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {post.views}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky bottom-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">
                    {selectedPostIds.length}件の作品を引用します
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/guides/${guideId}`}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
                  >
                    キャンセル
                  </Link>
                  <button
                    onClick={handleCite}
                    disabled={selectedPostIds.length === 0 || isSubmitting}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        引用中...
                      </>
                    ) : (
                      <>
                        <Link2 size={20} />
                        引用する
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

