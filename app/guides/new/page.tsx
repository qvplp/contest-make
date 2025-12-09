'use client';

import { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Upload,
  X,
  Save,
  ArrowRight,
  Eye,
  FileText,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CitedGuideUrlInput } from '@/components/guides/CitedGuideUrlInput';
import {
  ContentFormDto,
  initialContentFormData,
} from '@/modules/guide/application/dto/GuideFormDto';
import { SaveGuideDraft } from '@/modules/guide/application/SaveGuideDraft';
import { GetGuideDraft } from '@/modules/guide/application/GetGuideDraft';
import { LocalStorageGuideDraftRepository } from '@/modules/guide/infra/LocalStorageGuideDraftRepository';

const BlockEditor = dynamic(
  () => import('@/components/editor/BlockEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-800 rounded-lg p-4 min-h-[400px] animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    ),
  }
);

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function NewGuidePageContent() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articleIdRef = useRef<string>('');

  const [formData, setFormData] = useState<ContentFormDto>(initialContentFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLoaded, setIsLoaded] = useState(false);

  const draftRepo = useMemo(() => new LocalStorageGuideDraftRepository(), []);
  const saveDraft = useMemo(() => new SaveGuideDraft(draftRepo), [draftRepo]);
  const getDraft = useMemo(() => new GetGuideDraft(draftRepo), [draftRepo]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const existingId = searchParams.get('articleId');

    if (existingId) {
      articleIdRef.current = existingId;
      const draft = getDraft.execute(existingId);
      if (draft) {
        setFormData({
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          thumbnail: null,
          thumbnailPreview: draft.thumbnailPreview,
          citedGuides: draft.citedGuides ?? [],
        });
      }
    } else {
      articleIdRef.current = `article_${Date.now()}`;
    }

    setIsLoaded(true);
  }, [isLoggedIn, router, searchParams]);

  const handleThumbnailChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, thumbnail: '画像ファイルを選択してください' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: reader.result as string,
      }));
      setErrors((prev) => {
        const { thumbnail, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnailPreview: null,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'タイトルを入力してください';
    if (!formData.excerpt.trim()) newErrors.excerpt = '概要を入力してください';
    if (!formData.content.trim()) newErrors.content = '本文を入力してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!articleIdRef.current) return;
    setSaveStatus('saving');
    try {
      saveDraft.execute({
        articleId: articleIdRef.current,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        thumbnailPreview: formData.thumbnailPreview,
        citedGuides: formData.citedGuides,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleRemoveCitedGuide = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      citedGuides: prev.citedGuides.filter((g) => g.id !== id),
    }));
  };

  const handleNext = () => {
    if (!validate()) return;
    handleSave();
    router.push(`/guides/new/settings?articleId=${articleIdRef.current}`);
  };

  const handlePreview = () => {
    if (!validate()) return;
    handleSave();
    window.open(`/guides/new/preview?articleId=${articleIdRef.current}`, '_blank');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText size={32} className="text-purple-400" />
            記事を書く
          </h1>
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' && (
              <>
                <Clock size={16} className="text-yellow-400 animate-spin" />
                <span className="text-yellow-400">保存中...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-400">保存済み</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-red-400">保存エラー</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* サムネイル */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              サムネイル画像
            </label>
            {formData.thumbnailPreview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 max-w-md">
                <Image
                  src={formData.thumbnailPreview}
                  alt="サムネイル"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <Upload size={40} className="text-gray-500 mb-2" />
                <span className="text-gray-400">クリックして画像をアップロード</span>
                <span className="text-gray-500 text-sm mt-1">推奨: 1280×720px (16:9)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbnailChange(file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* タイトル */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              タイトル <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="記事のタイトルを入力"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-500 text-xl font-semibold
                       focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* 概要 */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              概要
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              placeholder="記事の概要を入力（一覧ページに表示されます）"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.excerpt && (
              <p className="text-red-400 text-sm mt-2">{errors.excerpt}</p>
            )}
          </div>

          {/* 本文（BlockNote） */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              本文
            </label>
            {isLoaded && (
              <BlockEditor
                initialContent={formData.content}
                onChange={(markdown) =>
                  setFormData((prev) => ({ ...prev, content: markdown }))
                }
                placeholder="/ を入力してブロックを追加..."
              />
            )}
            {errors.content && (
              <p className="text-red-400 text-sm mt-2">{errors.content}</p>
            )}
          </div>

          {/* 引用した記事 */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              引用した記事（オプション）
            </label>
            <p className="text-gray-500 text-sm mb-4">
              参考にした攻略記事のURLを貼り付けて追加できます
            </p>

            <CitedGuideUrlInput
              existingIds={formData.citedGuides.map((g) => g.id)}
              onAdd={(info) =>
                setFormData((prev) => ({
                  ...prev,
                  citedGuides: [
                    ...prev.citedGuides,
                    {
                      id: info.id,
                      title: info.title,
                      thumbnail: info.thumbnailUrl ?? undefined,
                    },
                  ],
                }))
              }
            />

            {formData.citedGuides.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.citedGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-300 font-mono text-sm truncate">
                      {guide.title || guide.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCitedGuide(guide.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* フッターアクション */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Save size={20} />
              下書き保存
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Eye size={20} />
                プレビュー
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2"
              >
                次へ
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function NewGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-950 min-h-screen py-8">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <NewGuidePageContent />
    </Suspense>
  );
}
