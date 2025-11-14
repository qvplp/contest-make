'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Tag,
  Copy,
  Check,
  Link2,
  Play,
  Image as ImageIcon,
} from 'lucide-react';

interface CitedArtwork {
  id: number;
  title: string;
  thumbnail: string;
  type: 'image' | 'video';
  author: string;
  authorId: string;
  likes: number;
  views: number;
}

interface CitedGuide {
  id: number;
  title: string;
  thumbnail: string;
  author: string;
  category: string;
  views: number;
  likes: number;
}

export default function GuideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const guideId = params.id;
  const { isLoggedIn, user } = useAuth();

  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState(342);
  const [comments, setComments] = useState<
    Array<{ id: number; author: string; text: string; date: string }>
  >([]);
  const [newComment, setNewComment] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const [citedArtworks, setCitedArtworks] = useState<CitedArtwork[]>([]);
  const [showAllCitedArtworks, setShowAllCitedArtworks] = useState(false);
  const [citedGuides, setCitedGuides] = useState<CitedGuide[]>([]);
  const [showAllCitedGuides, setShowAllCitedGuides] = useState(false);

  const guide = {
    id: 1,
    title: 'ハロウィン雰囲気を出すプロンプトテクニック10選',
    author: 'AIマスター',
    category: 'プロンプト技術',
    tags: ['ハロウィン', 'プロンプト', '初心者向け'],
    views: 2345,
    createdAt: '2025-10-20T10:00:00Z',
    content: `ハロウィンの雰囲気を醸し出す作品を作るには、プロンプトの選び方が重要です。`,
    prompts: [
      {
        id: 1,
        title: '基本のハロウィンシーン',
        text: 'Halloween night scene, full moon, pumpkins with glowing faces, spooky atmosphere',
        image: '/images/samples/sample1.jpg',
      },
    ],
  };

  // 引用された作品を読み込む
  useEffect(() => {
    const storedCitations = localStorage.getItem(`guide_citations_${guideId}`);
    if (storedCitations) {
      try {
        const citations = JSON.parse(storedCitations);
        setCitedArtworks(citations);
      } catch (e) {
        console.error('Failed to parse citations:', e);
      }
    }
  }, [guideId]);

  // 引用した記事を読み込む
  useEffect(() => {
    // 実際の実装では、APIから引用した記事を取得
    // ここでは、localStorageから取得するか、モックデータを使用
    // モックデータ：実際の実装では、記事IDから記事情報を取得
    const mockCitedGuides: CitedGuide[] = [
      {
        id: 1,
        title: 'プロンプトの基本テクニック',
        thumbnail: '/images/samples/sample1.jpg',
        author: 'AIマスター',
        category: 'プロンプト技術',
        views: 1234,
        likes: 89,
      },
      {
        id: 2,
        title: 'アニメーション作成のコツ',
        thumbnail: '/images/samples/sample2.jpg',
        author: 'クリエイター',
        category: 'アニメーション',
        views: 2345,
        likes: 156,
      },
    ];
    setCitedGuides(mockCitedGuides);
  }, [guideId]);

  const handleCiteClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push(`/guides/${guideId}/cite`);
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: 'あなた',
          text: newComment,
          date: new Date().toISOString(),
        },
      ]);
      setNewComment('');
    }
  };

  const copyPrompt = (promptId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(promptId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {guide.category}
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <span>{guide.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(guide.createdAt).toLocaleDateString('ja-JP')}
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              {guide.views}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700 flex flex-wrap gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              hasLiked
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <ThumbsUp size={18} fill={hasLiked ? 'currentColor' : 'none'} />
            いいね {likes}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition">
            <Share2 size={18} />
            シェア
          </button>
          {isLoggedIn && (
            <button
              onClick={handleCiteClick}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition text-white"
            >
              <Link2 size={18} />
              引用する
            </button>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-4 leading-relaxed">
              {guide.content}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">プロンプト例</h2>
          <div className="space-y-6">
            {guide.prompts.map((prompt) => (
              <div
                key={prompt.id}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="aspect-square relative">
                    <Image
                      src={prompt.image}
                      alt={prompt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="font-bold text-xl mb-3">{prompt.title}</h3>
                    <div className="bg-gray-900 rounded-lg p-4 mb-4 flex-1 relative">
                      <code className="text-sm text-gray-300 block">
                        {prompt.text}
                      </code>
                      <button
                        onClick={() => copyPrompt(prompt.id, prompt.text)}
                        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                      >
                        {copiedPrompt === prompt.id ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => copyPrompt(prompt.id, prompt.text)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      プロンプトをコピー
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle />
            コメント ({comments.length})
          </h2>

          <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを書く..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none mb-4"
            />
            <button
              onClick={handleComment}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition"
            >
              コメントする
            </button>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 引用された作品セクション */}
        {citedArtworks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Link2 size={28} className="text-purple-400" />
              引用された作品 ({citedArtworks.length})
            </h2>
            
            {!showAllCitedArtworks ? (
              <>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-4">
                  {citedArtworks.slice(0, 5).map((artwork) => (
                    <Link
                      key={artwork.id}
                      href={`/contest-posts/${artwork.id}`}
                      className="flex-shrink-0 w-48 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-800">
                        <Image
                          src={artwork.thumbnail}
                          alt={artwork.title}
                          fill
                          sizes="192px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {artwork.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                              <Play className="text-white" fill="white" size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                          <span>{artwork.author}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {artwork.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {artwork.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {citedArtworks.length > 5 && (
                  <button
                    onClick={() => setShowAllCitedArtworks(true)}
                    className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition text-gray-300"
                  >
                    すべて表示 ({citedArtworks.length}件)
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {citedArtworks.map((artwork) => (
                    <Link
                      key={artwork.id}
                      href={`/contest-posts/${artwork.id}`}
                      className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-800">
                        <Image
                          src={artwork.thumbnail}
                          alt={artwork.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {artwork.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                              <Play className="text-white" fill="white" size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition">
                          {artwork.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                          <span>{artwork.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {artwork.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {artwork.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllCitedArtworks(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition text-gray-300"
                >
                  折りたたむ
                </button>
              </>
            )}
          </div>
        )}

        {/* 引用した記事セクション */}
        {citedGuides.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Link2 size={28} className="text-purple-400" />
              引用した記事 ({citedGuides.length})
            </h2>
            
            {!showAllCitedGuides ? (
              <>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-4">
                  {citedGuides.slice(0, 5).map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.id}`}
                      className="flex-shrink-0 w-48 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-800">
                        <Image
                          src={guide.thumbnail}
                          alt={guide.title}
                          fill
                          sizes="192px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition">
                          {guide.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                          <span>{guide.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {guide.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {guide.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {citedGuides.length > 5 && (
                  <button
                    onClick={() => setShowAllCitedGuides(true)}
                    className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition text-gray-300"
                  >
                    すべて表示 ({citedGuides.length}件)
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {citedGuides.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.id}`}
                      className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-800">
                        <Image
                          src={guide.thumbnail}
                          alt={guide.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-400 transition">
                          {guide.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                          <span>{guide.author}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {guide.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            {guide.views}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllCitedGuides(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition text-gray-300"
                >
                  折りたたむ
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

