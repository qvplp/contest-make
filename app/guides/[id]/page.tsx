'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Link2,
  Calendar,
  Eye,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';

const BlockEditor = dynamic(() => import('@/components/editor/BlockEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-2/3"></div>
    </div>
  ),
});

interface Guide {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  category: string;
  classifications: string[];
  aiModels: string[];
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  citedGuides?: { id: string; title?: string; thumbnail?: string }[];
}

const mockGuide: Guide = {
  id: '1',
  title: '生成画像の季節ごとの色味分けについて',
  author: '@ai_master',
  authorAvatar: '/images/avatars/default.png',
  thumbnail: '/images/samples/guide-sample.jpg',
  excerpt:
    '生成AIで画像を作る際、季節ごとに色味を意識して分けると、同じテーマでも世界観の一貫性が生まれる。',
  content: `## はじめに

生成AIで画像を作る際、季節ごとに色味を意識して分けると、同じテーマでも世界観の一貫性が生まれ、ブランドや作品シリーズとしての印象が強まる。

## 春・夏の色味設計

春は淡いパステル、明るめのグリーンやピンクを中心に、コントラスト弱めで「ふんわり」。夏はビビッドなブルー、シアン、強めのハイライトで「澄んだ空気感」を出すと季節感が伝わりやすい。

### 春のプロンプト例

\`\`\`
soft pastel colors, gentle spring lighting, 
cherry blossoms, warm atmosphere
\`\`\`

### 夏のプロンプト例

\`\`\`
vivid blue sky, bright summer light, 
high contrast, clear atmosphere
\`\`\`

## 秋・冬の色味設計

秋はオレンジ、ブラウン、深いレッドなど暖色寄りにし、彩度を少し落としてノスタルジックに。冬はブルーグレー、白、シルバーを軸にコントラスト高め、影を冷たい色に振ると「ひんやり」した印象になる。

## ワークフローへの落とし込み

季節ごとに「パレット例」と「NG例」を決めておき、プロンプトに色や雰囲気のキーワードを必ず1〜2個入れる。生成後もホワイトバランスと彩度を微調整し、同じ季節の画像を横に並べて最終確認すると、シリーズとしての統一感が高まる。

---

> **ポイント**: 季節感を出すには、光の色温度も重要。春夏は暖かく、秋冬は冷たくするとより効果的。
`,
  category: 'プロンプト技術',
  classifications: ['アニメ', 'ワークフロー'],
  aiModels: ['Midjourney v7', 'Seedream'],
  tags: ['色彩', '季節', 'プロンプト'],
  likes: 234,
  comments: 45,
  views: 1234,
  createdAt: '2025-01-15T10:00:00Z',
  citedGuides: [
    { id: 'guide-001', title: '基本的なプロンプトの書き方' },
    { id: 'guide-002', title: 'Midjourneyスタイルガイド' },
  ],
};

export default function GuideDetailPage() {
  const params = useParams();
  const guideId = params.id as string;
  const { isLoggedIn, user } = useAuth();

  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<
    { id: string; author: string; text: string; createdAt: string }[]
  >([]);
  const [newComment, setNewComment] = useState('');
  const [citations, setCitations] = useState<any[]>([]);

  useEffect(() => {
    // 実際は API から guideId ごとの記事を取得する想定
    setGuide(mockGuide);
    setLikeCount(mockGuide.likes);

    const key = `guide_citations_${guideId}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (saved) {
      try {
        setCitations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse citations:', e);
      }
    }
  }, [guideId]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: guide?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert('URLをコピーしました');
    }
  };

  const handleComment = () => {
    if (!newComment.trim() || !user) return;

    const comment = {
      id: `comment_${Date.now()}`,
      author: user.name || 'ユーザー',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  if (!guide) {
    return (
      <div className="bg-gray-950 min-h-screen py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
        >
          <Link2 size={20} />
          攻略一覧に戻る
        </Link>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {guide.category}
            </span>
            {guide.classifications.map((c) => (
              <span
                key={c}
                className="bg-blue-600/50 text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {c}
              </span>
            ))}
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
              {guide.views.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
            <Image
              src={guide.thumbnail}
              alt={guide.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isLiked
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ThumbsUp size={20} className={isLiked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            <Share2 size={20} />
            シェア
          </button>

          {isLoggedIn && (
            <Link
              href={`/guides/${guideId}/cite`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition ml-auto"
            >
              <Link2 size={20} />
              引用する
            </Link>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <p className="text-gray-300 leading-relaxed text-lg">{guide.excerpt}</p>
        </div>

        <article className="bg-gray-800/40 rounded-xl p-8 border border-gray-700 mb-8">
          <BlockEditor initialContent={guide.content} editable={false} />
        </article>

        {guide.citedGuides && guide.citedGuides.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-4">📚 引用した記事</h3>
            <div className="space-y-3">
              {guide.citedGuides.map((cited) => (
                <Link
                  key={cited.id}
                  href={`/guides/${cited.id}`}
                  className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition"
                >
                  <p className="text-gray-300">{cited.title || cited.id}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {citations.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-4">🎨 この記事を参考にした作品</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {citations.map((citation) => (
                <div
                  key={citation.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-800"
                >
                  <Image
                    src={citation.thumbnail}
                    alt={citation.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-sm font-medium truncate">{citation.title}</p>
                    <p className="text-xs text-gray-400">{citation.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle size={20} />
            コメント ({guide.comments + comments.length})
          </h3>

          {isLoggedIn ? (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-500 resize-none mb-3
                         focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                コメントする
              </button>
            </div>
          ) : (
            <p className="text-gray-400 mb-6">
              コメントするには
              <Link href="/login" className="text-purple-400 hover:underline mx-1">
                ログイン
              </Link>
              してください
            </p>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


