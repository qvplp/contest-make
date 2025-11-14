'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Upload,
  X,
  Save,
  History,
  CheckCircle,
  ArrowRight,
  Eye,
  Plus,
  Link2,
} from 'lucide-react';
import SectionManager from '@/components/editor/SectionManager';
import MarkdownPreview from '@/components/editor/MarkdownPreview';
import DraftHistoryModal from '@/components/editor/DraftHistoryModal';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUnloadGuard } from '@/hooks/useUnloadGuard';
import {
  Section,
  getDraft,
  getDraftHistories,
  restoreDraftVersion,
} from '@/utils/draftManager';
import { ContentFormData, CitedGuide } from '@/types/guideForm';

export default function NewGuidePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articleIdRef = useRef<string>(`article_${Date.now()}`);

  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    excerpt: '',
    sections: [],
    thumbnail: null,
    thumbnailPreview: null,
    citedGuides: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEditorPreview, setShowEditorPreview] = useState(true);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [draftHistories, setDraftHistories] = useState(getDraftHistories(articleIdRef.current));

  // 自動保存
  const { saveNow, hasUnsavedChanges: hasChanges } = useAutoSave({
    articleId: articleIdRef.current,
    title: formData.title,
    sections: formData.sections,
    excerpt: formData.excerpt,
    thumbnailPreview: formData.thumbnailPreview ?? undefined,
    citedGuides: formData.citedGuides,
    onSaveSuccess: () => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setDraftHistories(getDraftHistories(articleIdRef.current));
    },
    onSaveError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

  // ページ離脱ガード
  useUnloadGuard(hasChanges, '未保存の変更があります。このページを離れますか？');

  // 下書きの復元
  useEffect(() => {
    const draft = getDraft(articleIdRef.current);
    if (draft) {
      const shouldRestore = confirm(
        '下書きが見つかりました。復元しますか？\n\n「キャンセル」を選択すると、新しい記事として開始します。'
      );
      if (shouldRestore) {
        setFormData((prev) => ({
          ...prev,
          title: draft.title,
          sections: draft.sections,
          excerpt: draft.excerpt ?? '',
          thumbnailPreview: draft.thumbnailPreview ?? null,
          citedGuides: draft.citedGuides ?? [],
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleThumbnailChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, thumbnail: '画像ファイルを選択してください' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: e.target?.result as string,
      }));
      setErrors((prev) => {
        const { thumbnail, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  // セクションから本文を生成（公開されているセクションのみ）
  const generateContent = (): string => {
    return formData.sections
      .filter((s) => s.is_published)
      .map((s) => {
        if (s.title.trim()) {
          return `## ${s.title}\n\n${s.body_md}`;
        }
        return s.body_md;
      })
      .join('\n\n---\n\n');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'タイトルを入力してください';
    if (!formData.excerpt.trim()) newErrors.excerpt = '概要を入力してください';
    if (formData.sections.length === 0) {
      newErrors.sections = '少なくとも1つのセクションを作成してください';
    } else {
      const hasPublishedSection = formData.sections.some((s) => s.is_published);
      if (!hasPublishedSection) {
        newErrors.sections = '少なくとも1つのセクションを公開状態にしてください';
      }
      const hasContent = formData.sections.some((s) => s.body_md.trim());
      if (!hasContent) {
        newErrors.sections = 'セクションに内容を入力してください';
      }
    }
    if (!formData.thumbnail) newErrors.thumbnail = 'サムネイル画像をアップロードしてください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    setSaveStatus('saving');
    saveNow();
  };

  const handleRestoreVersion = (version: number) => {
    const restored = restoreDraftVersion(articleIdRef.current, version);
    if (restored) {
      setFormData((prev) => ({
        ...prev,
        title: restored.title,
        sections: restored.sections,
        excerpt: restored.excerpt ?? '',
        thumbnailPreview: restored.thumbnailPreview ?? null,
        citedGuides: restored.citedGuides ?? [],
      }));
    }
  };

  const addCitedGuide = () => {
    setFormData((prev) => ({
      ...prev,
      citedGuides: [...prev.citedGuides, { id: '' }],
    }));
  };

  const updateCitedGuide = (index: number, guideId: string) => {
    setFormData((prev) => ({
      ...prev,
      citedGuides: prev.citedGuides.map((guide, i) =>
        i === index ? { ...guide, id: guideId } : guide
      ),
    }));
  };

  const removeCitedGuide = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      citedGuides: prev.citedGuides.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    // テスト用：バリデーションなしで常に遷移可能
    // 最終保存
    saveNow();
    // 第2ページ（設定ページ）に遷移
    router.push(`/guides/new/settings?articleId=${articleIdRef.current}`);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">攻略記事を投稿</h1>
          <p className="text-gray-400">タイトル、概要、本文を入力してください</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block font-semibold mb-3 text-lg">
              サムネイル画像 <span className="text-red-500">*</span>
            </label>

            {!formData.thumbnail ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-12 text-center cursor-pointer transition"
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg font-semibold mb-2">クリックして画像をアップロード</p>
                <p className="text-sm text-gray-400">推奨サイズ: 1200x675px</p>
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
              </div>
            ) : (
              <div className="relative">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image src={formData.thumbnailPreview!} alt="サムネイル" fill className="object-cover" />
                </div>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, thumbnail: null, thumbnailPreview: null }))}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {errors.thumbnail && <p className="text-red-400 text-sm mt-2">{errors.thumbnail}</p>}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block font-semibold mb-3">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="例: ハロウィン雰囲気を出すプロンプトテクニック10選"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title}</p>}
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <label className="block font-semibold mb-3">
              概要 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="記事の概要を簡潔に説明してください"
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />
            {errors.excerpt && <p className="text-red-400 text-sm mt-2">{errors.excerpt}</p>}
          </div>

          {/* セクション管理エディタ */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="block font-semibold text-lg">
                本文 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400"></div>
                    保存中...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle size={12} />
                    保存済み
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-xs text-red-400">保存エラー</span>
                )}
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                >
                  <Save size={14} />
                  保存
                </button>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                >
                  <History size={14} />
                  履歴
                </button>
              </div>
            </div>

            <SectionManager
              sections={formData.sections}
              onSectionsChange={(sections) =>
                setFormData((prev) => ({ ...prev, sections }))
              }
              onSave={handleSave}
            />

            {errors.sections && (
              <p className="text-red-400 text-sm mt-2">{errors.sections}</p>
            )}

            {/* エディタ/プレビュー切り替え */}
            {formData.sections.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">ライブプレビュー</h3>
                  <button
                    onClick={() => setShowEditorPreview(!showEditorPreview)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition"
                  >
                    {showEditorPreview ? 'プレビューを閉じる' : 'プレビューを表示'}
                  </button>
                </div>
                {showEditorPreview && (
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto">
                    <MarkdownPreview
                      markdown={formData.sections
                        .filter((s) => s.is_published)
                        .map((s) => {
                          if (s.title.trim()) {
                            return `## ${s.title}\n\n${s.body_md}`;
                          }
                          return s.body_md;
                        })
                        .join('\n\n---\n\n')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 引用した記事セクション */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <label className="block font-semibold text-lg flex items-center gap-2">
                <Link2 size={20} className="text-purple-400" />
                引用した記事
                <span className="text-sm font-normal text-gray-400">（任意）</span>
              </label>
              <button
                onClick={addCitedGuide}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition flex items-center gap-1"
              >
                <Plus size={14} />
                追加
              </button>
            </div>

            {formData.citedGuides.length === 0 ? (
              <p className="text-gray-400 text-sm">引用したい記事がない場合は、このセクションをスキップできます。</p>
            ) : (
              <div className="space-y-3">
                {formData.citedGuides.map((guide, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-400 mb-1">記事ID</label>
                      <input
                        type="text"
                        value={guide.id}
                        onChange={(e) => updateCitedGuide(index, e.target.value)}
                        placeholder="例: 1, 2, 3..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeCitedGuide(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition flex-shrink-0"
                      title="削除"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.citedGuides.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">
                💡 引用したい記事のIDを入力してください。記事が公開されると、引用した記事として表示されます。
              </p>
            )}
          </div>

          {/* 次へボタン */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowFullPreview(!showFullPreview)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <Eye size={20} />
              全体プレビュー
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition flex items-center gap-2"
            >
              次へ
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 全体プレビューモーダル */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">プレビュー</h2>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{formData.title || 'タイトル未設定'}</h1>
                <p className="text-gray-400">{formData.excerpt || '概要未設定'}</p>
              </div>
              <MarkdownPreview markdown={generateContent()} />
            </div>
          </div>
        </div>
      )}

      {/* 下書き履歴モーダル */}
      <DraftHistoryModal
        articleId={articleIdRef.current}
        histories={draftHistories}
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onRestore={handleRestoreVersion}
      />
    </div>
  );
}
