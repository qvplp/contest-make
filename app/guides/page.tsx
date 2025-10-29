'use client';

import { useState } from 'react';
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
} from 'lucide-react';

interface Guide {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  tags: string[];
}

export default function GuidesPage() {
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const guides: Guide[] = [
    {
      id: 1,
      title: 'ハロウィン雰囲気を出すプロンプトテクニック10選',
      author: 'AIマスター',
      authorAvatar: '/images/avatars/user1.jpg',
      thumbnail: '/images/samples/sample1.jpg',
      excerpt:
        '不気味で幻想的なハロウィンの雰囲気を作り出すためのプロンプトのコツを解説します。',
      category: 'プロンプト技術',
      likes: 342,
      comments: 45,
      views: 2345,
      createdAt: '2025-10-20T10:00:00Z',
      tags: ['ハロウィン', 'プロンプト', '初心者向け'],
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
  ];

  const sortedGuides = [...guides].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filteredGuides = sortedGuides.filter((guide) => {
    const categoryMatch =
      selectedCategory === 'all' || guide.category === selectedCategory;
    const searchMatch =
      searchQuery === '' ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="text-purple-400" />
                攻略・使い方
              </h1>
              <p className="text-gray-400">
                AIクリエイターのためのナレッジベース
              </p>
            </div>
            <Link
              href="/guides/new"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Plus size={20} />
              記事を投稿
            </Link>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="記事を検索..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-600 transition group"
            >
              <div className="aspect-video relative">
                <Image
                  src={guide.thumbnail}
                  alt={guide.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {guide.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {guide.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                    >
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

        {filteredGuides.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">該当する記事がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

