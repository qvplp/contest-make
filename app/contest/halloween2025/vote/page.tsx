'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Heart,
  Play,
  Filter,
  TrendingUp,
  X,
  Share2,
  Eye,
} from 'lucide-react';

interface Submission {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  videoUrl?: string;
  votes: number;
  views: number;
  categories: string[];
  division: string;
  createdAt: string;
  description: string;
  isVideo: boolean;
  hasVoted?: boolean;
}

export default function VotePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const mockSubmissions: Submission[] = [
      {
        id: 1,
        title: 'おばけハロウィン',
        author: 'user_123',
        imageUrl: '/images/samples/sample1.jpg',
        votes: 245,
        views: 1234,
        categories: ['最優秀ハロウィン雰囲気賞'],
        division: 'アニメ短編',
        createdAt: '2025-10-15T10:00:00Z',
        description: 'トリックオアトリート！をテーマにしたハロウィンの夜の物語',
        isVideo: false,
      },
      {
        id: 2,
        title: '魔女の宅配便',
        author: 'artist_456',
        imageUrl: '/images/samples/sample2.jpg',
        videoUrl: '/videos/sample2.mp4',
        votes: 189,
        views: 987,
        categories: ['最優秀キャラクター賞', '最優秀アニメーション賞'],
        division: 'アニメ短編',
        createdAt: '2025-10-14T15:30:00Z',
        description: '魔女が夜空を飛ぶ幻想的なアニメーション',
        isVideo: true,
      },
      {
        id: 3,
        title: 'パンプキンナイト',
        author: 'creator_789',
        imageUrl: '/images/samples/sample3.jpg',
        votes: 156,
        views: 765,
        categories: ['最優秀ホラー演出賞'],
        division: 'イラスト',
        createdAt: '2025-10-13T09:15:00Z',
        description: 'かぼちゃのランタンが並ぶ不気味な夜',
        isVideo: false,
      },
      {
        id: 4,
        title: '満月の海賊船',
        author: 'pirate_012',
        imageUrl: '/images/samples/sample5.jpg',
        videoUrl: '/videos/sample5.mp4',
        votes: 134,
        views: 654,
        categories: ['最優秀ハロウィン雰囲気賞'],
        division: 'アニメ短編',
        createdAt: '2025-10-12T14:20:00Z',
        description: '満月の夜、幽霊船が海を渡る',
        isVideo: true,
      },
      {
        id: 5,
        title: 'スチームパンクハロウィン',
        author: 'steampunk_345',
        imageUrl: '/images/samples/sample7.jpg',
        votes: 112,
        views: 543,
        categories: ['最優秀キャラクター賞'],
        division: 'イラスト',
        createdAt: '2025-10-11T11:45:00Z',
        description: 'スチームパンクな世界観のハロウィン',
        isVideo: false,
      },
      {
        id: 6,
        title: 'ダンスパーティー',
        author: 'dancer_678',
        imageUrl: '/images/samples/sample8.jpg',
        videoUrl: '/videos/sample8.mp4',
        votes: 98,
        views: 432,
        categories: ['最優秀アニメーション賞'],
        division: 'アニメ短編',
        createdAt: '2025-10-10T16:00:00Z',
        description: 'ハロウィンパーティーで踊るキャラクターたち',
        isVideo: true,
      },
    ];

    setSubmissions(mockSubmissions);
  }, [isLoggedIn, router]);

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filteredSubmissions = sortedSubmissions.filter((submission) => {
    const categoryMatch =
      selectedCategory === 'all' || submission.categories.includes(selectedCategory);
    const divisionMatch =
      selectedDivision === 'all' || submission.division === selectedDivision;
    return categoryMatch && divisionMatch;
  });

  const handleVote = (id: number) => {
    setSubmissions((prev) =>
      prev.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              votes: submission.hasVoted ? submission.votes - 1 : submission.votes + 1,
              hasVoted: !submission.hasVoted,
            }
          : submission
      )
    );
  };

  const openModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  if (!isLoggedIn) {
    return null;
  }

  const categories = [
    'all',
    '最優秀ハロウィン雰囲気賞',
    '最優秀キャラクター賞',
    '最優秀アニメーション賞',
    '最優秀ホラー演出賞',
  ];

  const divisions = ['all', 'イラスト', 'アニメ短編'];

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">作品に投票する</h1>
          <p className="text-gray-400">
            素晴らしい作品にいいねして、クリエイターを応援しましょう！
          </p>
        </div>

        {/* フィルター・ソートバー */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* ソート */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={16} />
                並び替え
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'votes' | 'recent')}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="votes">得票数が多い順</option>
                <option value="recent">投稿が新しい順</option>
              </select>
            </div>

            {/* カテゴリーフィルター */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter size={16} />
                カテゴリー
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'すべてのカテゴリー' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 作品部門フィルター */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter size={16} />
                作品部門
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div === 'all' ? 'すべての部門' : div}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 作品一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
            >
              {/* 画像/動画サムネイル */}
              <div
                className="aspect-square relative cursor-pointer"
                onClick={() => openModal(submission)}
              >
                <Image
                  src={submission.imageUrl}
                  alt={submission.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                {submission.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="text-white" size={48} />
                  </div>
                )}
                {/* オーバーレイ */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm">
                    <Eye size={14} />
                    {submission.views}
                  </div>
                </div>
              </div>

              {/* 情報 */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{submission.title}</h3>
                <p className="text-sm text-gray-400 mb-3">by {submission.author}</p>

                {/* カテゴリータグ */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {submission.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* アクション */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleVote(submission.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                      submission.hasVoted
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={submission.hasVoted ? 'currentColor' : 'none'}
                    />
                    {submission.votes}
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 結果が0件の場合 */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">該当する作品がありません</p>
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedSubmission.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              {/* メディア */}
              <div className="aspect-video relative mb-6 bg-black rounded-xl overflow-hidden">
                {selectedSubmission.isVideo ? (
                  <video
                    src={selectedSubmission.videoUrl}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={selectedSubmission.imageUrl}
                    alt={selectedSubmission.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* 作品情報 */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">作者</h3>
                  <p className="text-gray-300">{selectedSubmission.author}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">説明</h3>
                  <p className="text-gray-300">{selectedSubmission.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">応募カテゴリー</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.categories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">作品部門</h3>
                  <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                    {selectedSubmission.division}
                  </span>
                </div>

                {/* アクション */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handleVote(selectedSubmission.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                      selectedSubmission.hasVoted
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={selectedSubmission.hasVoted ? 'currentColor' : 'none'}
                    />
                    {selectedSubmission.hasVoted ? '投票済み' : '投票する'} (
                    {selectedSubmission.votes})
                  </button>
                  <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition flex items-center gap-2">
                    <Share2 size={20} />
                    シェア
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
