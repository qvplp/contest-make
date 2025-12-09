'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ArrowLeft, Edit3, Send, Eye, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GetGuideDraft } from '@/modules/guide/application/GetGuideDraft';
import { GetGuideSettings } from '@/modules/guide/application/GetGuideSettings';
import { LocalStorageGuideDraftRepository } from '@/modules/guide/infra/LocalStorageGuideDraftRepository';
import { LocalStorageGuideSettingsRepository } from '@/modules/guide/infra/LocalStorageGuideSettingsRepository';
import type { GuideDraft } from '@/modules/guide/domain/GuideDraft';
import type { GuideSettings } from '@/modules/guide/domain/GuideSettings';

const BlockEditor = dynamic(
  () => import('@/components/editor/BlockEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    ),
  }
);

function GuidePreviewContent() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId') || '';

  const [draft, setDraft] = useState<GuideDraft | null>(null);
  const [settings, setSettings] = useState<GuideSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const draftRepo = useMemo(() => new LocalStorageGuideDraftRepository(), []);
  const settingsRepo = useMemo(
    () => new LocalStorageGuideSettingsRepository(),
    []
  );
  const getDraft = useMemo(() => new GetGuideDraft(draftRepo), [draftRepo]);
  const getSettings = useMemo(
    () => new GetGuideSettings(settingsRepo),
    [settingsRepo]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!articleId) {
      router.push('/guides/new');
      return;
    }

    const d = getDraft.execute(articleId);
    if (!d) {
      alert('記事データが見つかりません。最初からやり直してください。');
      router.push('/guides/new');
      return;
    }

    const s = getSettings.execute(articleId);

    setDraft(d);
    setSettings(s);
    setIsLoaded(true);
  }, [isLoggedIn, router, articleId]);

  // 投稿処理（モック）
  const handlePublish = () => {
    alert('投稿しました！（モック）');
    router.push('/guides');
  };

  if (!isLoggedIn || !draft) return null;

  const fallbackThumbnail =
    'https://images.pinyogram.com/Screenshot%202025-11-26%20at%2015.05.05.png';
  const thumbnail = draft.thumbnailPreview || fallbackThumbnail;
  const displayTitle = draft.title || '（タイトル未設定）';
  const displayExcerpt = draft.excerpt || '';
  const displayContent = draft.content || '';

  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const authorName = user?.name || '@anonymous';
  const tags = settings?.tags || [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 固定ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 左: 戻るボタン */}
          <button
            onClick={() => router.push(`/guides/new/settings?articleId=${articleId}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">編集に戻る</span>
          </button>

          {/* 中央: プレビューラベル */}
          <div className="flex items-center gap-2 text-yellow-500">
            <Eye size={18} />
            <span className="text-sm font-medium">プレビュー</span>
          </div>

          {/* 右: アクションボタン */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/guides/new?articleId=${articleId}`)}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition"
            >
              <Edit3 size={18} />
              <span className="hidden sm:inline">編集</span>
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition"
            >
              <Send size={18} />
              <span>投稿する</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-14">
        {/* ヒーローセクション（サムネイル） */}
        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] bg-gray-900">
          <Image
            src={thumbnail}
            alt={displayTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        </div>

        {/* 記事コンテンツエリア */}
        <article className="relative -mt-32 sm:-mt-40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            {/* カテゴリ・タグ */}
            {(settings?.category || tags.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {settings?.category && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {settings.category}
                  </span>
                )}
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* タイトル */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {displayTitle}
            </h1>

            {/* 著者情報 */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium">{authorName}</p>
                <p className="text-gray-400 text-sm">{today}</p>
              </div>
            </div>

            {/* 概要（あれば） */}
            {displayExcerpt && (
              <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border-l-4 border-purple-500">
                <p className="text-gray-300 text-lg leading-relaxed">{displayExcerpt}</p>
              </div>
            )}

            {/* 本文 - BlockNoteを読み取り専用モードで表示 */}
            <div className="mb-12">
              {isLoaded && displayContent && (
                <BlockEditor
                  initialContent={displayContent}
                  editable={false}
                />
              )}
              {isLoaded && !displayContent && (
                <p className="text-gray-500 text-center py-8">（本文未入力）</p>
              )}
            </div>

            {/* 引用した記事 */}
            {draft.citedGuides && draft.citedGuides.length > 0 && (
              <div className="mb-12 pt-8 border-t border-gray-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📚 引用した記事
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draft.citedGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    >
                      <p className="text-gray-300 font-medium">
                        {guide.title || `記事ID: ${guide.id}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* インタラクションバー（デモ用） */}
            <div className="flex items-center justify-center gap-6 py-8 border-t border-gray-800">
              <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition">
                <ThumbsUp size={24} />
                <span>いいね</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition">
                <MessageCircle size={24} />
                <span>コメント</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition">
                <Share2 size={24} />
                <span>シェア</span>
              </button>
            </div>
          </div>
        </article>

        {/* フッター */}
        <footer className="py-12 text-center text-gray-500 text-sm">
          <p>これはプレビューです。実際の公開ページとは若干異なる場合があります。</p>
        </footer>
      </main>
    </div>
  );
}

export default function GuidePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">プレビューを読み込み中...</p>
          </div>
        </div>
      }
    >
      <GuidePreviewContent />
    </Suspense>
  );
}


