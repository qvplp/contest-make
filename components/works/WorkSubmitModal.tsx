'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Eye, Shield, Link2, FileVideo } from 'lucide-react';
import { useWorks } from '@/contexts/WorksContext';
import { AI_MODEL_OPTIONS, CLASSIFICATION_OPTIONS } from '@/constants/taxonomies';
import { AIModel, Classification } from '@/types/guideForm';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';

interface WorkSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  title: string;
  summary: string;
  mediaType: 'image' | 'video';
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  visibility: 'public' | 'private';
};

type ReferenceItem = {
  id: string;
  url: string;
};

const initialFormState: FormState = {
  title: '',
  summary: '',
  mediaType: 'image',
  classifications: [],
  aiModels: [],
  tags: [],
  visibility: 'public',
};

export default function WorkSubmitModal({ isOpen, onClose }: WorkSubmitModalProps) {
  const { createWork } = useWorks();
  const [isMounted, setIsMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setMediaPreview('');
      setTagInput('');
      setReferences([]);
      setReferenceInput('');
      setReferenceError(null);
      setIsSubmitting(false);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMediaPreview(result);
      setFormState((prev) => ({
        ...prev,
        mediaType: isVideo ? 'video' : 'image',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClassificationToggle = (classification: Classification) => {
    setFormState((prev) => {
      const exists = prev.classifications.includes(classification);
      const nextClassifications = exists
        ? prev.classifications.filter((item) => item !== classification)
        : [...prev.classifications, classification];

      return {
        ...prev,
        classifications: nextClassifications,
        aiModels:
          classification === 'AIモデル' && exists
            ? []
            : prev.aiModels,
      };
    });
  };

  const handleAIModelToggle = (model: AIModel) => {
    setFormState((prev) => {
      const exists = prev.aiModels.includes(model);
      return {
        ...prev,
        aiModels: exists
          ? prev.aiModels.filter((item) => item !== model)
          : [...prev.aiModels, model],
      };
    });
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || formState.tags.includes(value)) return;
    setFormState((prev) => ({
      ...prev,
      tags: [...prev.tags, value],
    }));
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setFormState((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const extractGuideIdFromUrl = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!trimmed.includes('/')) {
      return trimmed;
    }
    try {
      const url = trimmed.startsWith('http')
        ? new URL(trimmed)
        : new URL(trimmed, window.location.origin);
      const segments = url.pathname.split('/').filter(Boolean);
      const guideIndex = segments.indexOf('guides');
      if (guideIndex >= 0 && segments[guideIndex + 1]) {
        return segments[guideIndex + 1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleAddReference = () => {
    const id = extractGuideIdFromUrl(referenceInput);
    if (!id) {
      setReferenceError('有効な攻略記事URLまたはIDを入力してください');
      return;
    }
    if (references.some((ref) => ref.id === id)) {
      setReferenceError('同じ記事がすでに追加されています');
      return;
    }
    setReferences((prev) => [...prev, { id, url: referenceInput.trim() }]);
    setReferenceInput('');
    setReferenceError(null);
  };

  const removeReference = (id: string) => {
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
  };

  const isValid = useMemo(() => {
    const hasTitle = formState.title.trim().length > 0;
    const hasMedia = Boolean(mediaPreview);
    const hasClassification = formState.classifications.length > 0;
    const aiModelRequirement =
      !formState.classifications.includes('AIモデル') ||
      formState.aiModels.length > 0;

    return hasTitle && hasMedia && hasClassification && aiModelRequirement;
  }, [formState, mediaPreview]);

  const handleSubmit = async () => {
    if (!isValid || !mediaPreview) return;
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const result = createWork({
      title: formState.title.trim(),
      summary: formState.summary.trim(),
      mediaType: formState.mediaType,
      mediaSource: mediaPreview,
      classifications: formState.classifications,
      aiModels: formState.classifications.includes('AIモデル')
        ? formState.aiModels
        : [],
      tags: formState.tags,
      visibility: formState.visibility,
      referencedGuideIds: references.map((ref) => ref.id),
    });

    if (!result.success) {
      setError(result.error || '投稿に失敗しました');
      setIsSubmitting(false);
      return;
    }

    setSuccess('作品を投稿しました');
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <p className="text-sm text-gray-400">作品投稿フォーム</p>
            <h2 className="text-2xl font-bold">新しい作品を投稿</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition"
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="作品タイトルを入力"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                概要
              </label>
              <textarea
                value={formState.summary}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, summary: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[120px]"
                placeholder="作品の説明や制作意図を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                メディアファイル <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="w-full bg-gray-800 border border-dashed border-gray-600 rounded-lg px-4 py-6 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-xs text-gray-500 mt-2">
                画像または動画をアップロードしてください（最大約5MB推奨）。動画はmp4推奨です。
              </p>
              {mediaPreview && (
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Eye size={16} />
                    プレビュー（{formState.mediaType === 'video' ? '動画' : '画像'}）
                  </p>
                  <WorkMediaPreview
                    mediaType={formState.mediaType}
                    src={mediaPreview}
                    aspectRatio="16/9"
                    className="rounded-xl"
                    showVideoControls
                    autoPlayVideo={false}
                    mutedVideo={false}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                公開設定
              </label>
              <select
                value={formState.visibility}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    visibility: e.target.value as 'public' | 'private',
                  }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="public">公開</option>
                <option value="private">非公開</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                分類（複数選択可） <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CLASSIFICATION_OPTIONS.map((classification) => (
                  <button
                    key={classification}
                    type="button"
                    onClick={() => handleClassificationToggle(classification)}
                    className={`p-3 rounded-lg border-2 text-left transition ${
                      formState.classifications.includes(classification)
                        ? 'border-purple-600 bg-purple-900/30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {classification}
                  </button>
                ))}
              </div>
            </div>

            {formState.classifications.includes('AIモデル') && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  使用AIモデル（複数選択可） <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {AI_MODEL_OPTIONS.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => handleAIModelToggle(model)}
                      className={`p-3 rounded-lg border-2 text-left transition ${
                        formState.aiModels.includes(model)
                          ? 'border-cyan-600 bg-cyan-900/30'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">
                タグ
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="タグを入力してEnter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  <Upload size={16} />
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formState.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label="タグを削除"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Link2 size={16} />
                参考にした攻略記事
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={referenceInput}
                  onChange={(e) => setReferenceInput(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="攻略記事のURLまたはID（例: https://.../guides/123）"
                />
                <button
                  type="button"
                  onClick={handleAddReference}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 hover:border-purple-500 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  追加
                </button>
              </div>
              {referenceError && <p className="text-sm text-red-400">{referenceError}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {references.map((ref) => (
                  <span
                    key={ref.id}
                    className="flex items-center gap-2 bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs"
                  >
                    {ref.id}
                    <button onClick={() => removeReference(ref.id)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                参考にした攻略記事を追加すると、各記事の「引用された作品」セクションに表示されます。
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-start gap-3 text-sm text-gray-400">
              <Shield size={18} className="text-purple-400 flex-shrink-0" />
              <div>
                投稿後はマイページの投稿作品タブから公開/非公開を切り替え可能です。動画をアップロードした場合は
                <FileVideo size={12} className="inline mx-1" />
                アイコンが付きます。
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-gray-400">
            {error && <span className="text-red-400">{error}</span>}
            {success && <span className="text-green-400">{success}</span>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 font-semibold transition flex items-center gap-2"
            >
              投稿する
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}


