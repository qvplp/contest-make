'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Eye, Shield, Link2, FileVideo, Youtube } from 'lucide-react';
import { useWorks } from '@/contexts/WorksContext';
import { AI_MODEL_OPTIONS, CLASSIFICATION_OPTIONS } from '@/constants/taxonomies';
import { AIModel, Classification } from '@/types/guideForm';
import { ExternalLink, Work } from '@/types/works';
import { validateExternalLink } from '@/utils/externalLinks';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';

interface WorkSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  workToEdit?: Work | null;
  onEditSuccess?: () => void;
  onSubmitSuccess?: (work: Work) => void;
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

export default function WorkSubmitModal({
  isOpen,
  onClose,
  workToEdit,
  onEditSuccess,
  onSubmitSuccess,
}: WorkSubmitModalProps) {
  const { createWork, updateWork } = useWorks();
  const [isMounted, setIsMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [externalLinkInput, setExternalLinkInput] = useState('');
  const [externalLinkError, setExternalLinkError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEditMode = !!workToEdit;

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
      setExternalLinks([]);
      setExternalLinkInput('');
      setExternalLinkError(null);
      setIsSubmitting(false);
      setError(null);
      setSuccess(null);
    } else if (workToEdit) {
      // 編集モード: 既存の作品データをフォームに設定
      setFormState({
        title: workToEdit.title,
        summary: workToEdit.summary,
        mediaType: workToEdit.mediaType,
        classifications: workToEdit.classifications,
        aiModels: workToEdit.aiModels,
        tags: workToEdit.tags,
        visibility: workToEdit.visibility,
      });
      setMediaPreview(workToEdit.mediaSource);
      setReferences(
        workToEdit.referencedGuideIds?.map((id) => ({ id, url: `/guides/${id}` })) || [],
      );
      setExternalLinks(workToEdit.externalLinks || []);
    }
  }, [isOpen, workToEdit]);

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
      if (typeof window === 'undefined') {
        // SSR環境では相対URLを処理できないため、絶対URLのみ処理
        if (!trimmed.startsWith('http')) {
          return null;
        }
      }
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

  const handleAddExternalLink = () => {
    const trimmed = externalLinkInput.trim();
    if (!trimmed) {
      setExternalLinkError('URLを入力してください');
      return;
    }

    // YouTube URLのバリデーション
    const validation = validateExternalLink(trimmed, ['youtube']);
    if (!validation.valid || !validation.type) {
      setExternalLinkError(validation.error || '有効なYouTube URLを入力してください');
      return;
    }

    // 重複チェック
    if (externalLinks.some((link) => link.url === trimmed)) {
      setExternalLinkError('同じURLがすでに追加されています');
      return;
    }

    const newLink: ExternalLink = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `link_${Date.now()}`,
      type: validation.type,
      url: trimmed,
    };

    setExternalLinks((prev) => [...prev, newLink]);
    setExternalLinkInput('');
    setExternalLinkError(null);
  };

  const removeExternalLink = (id: string) => {
    setExternalLinks((prev) => prev.filter((link) => link.id !== id));
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

    const workData = {
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
      externalLinks: externalLinks.length > 0 ? externalLinks : undefined,
    };

    if (isEditMode && workToEdit) {
      const result = updateWork(workToEdit.id, workData);
      if (!result.success) {
        setError(result.error || '編集に失敗しました');
        setIsSubmitting(false);
        return;
      }
      setSuccess('作品を編集しました');
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        if (onEditSuccess) {
          onEditSuccess();
        }
      }, 1200);
    } else {
      const result = createWork(workData);
      if (!result.success) {
        setError(result.error || '投稿に失敗しました');
        setIsSubmitting(false);
        return;
      }
      setSuccess('作品を投稿しました');
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
        if (result.work && onSubmitSuccess) {
          onSubmitSuccess(result.work);
        }
      }, 1200);
    }
  };

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-4xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <p className="text-sm text-gray-400">{isEditMode ? '作品編集フォーム' : '作品投稿フォーム'}</p>
            <h2 className="text-2xl font-bold">{isEditMode ? '作品を編集' : '新しい作品を投稿'}</h2>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddReference();
                    }
                  }}
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

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Youtube size={16} className="text-red-500" />
                YouTubeリンク（任意）
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={externalLinkInput}
                  onChange={(e) => setExternalLinkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExternalLink();
                    }
                  }}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="YouTube URL（例: https://www.youtube.com/watch?v=...）"
                />
                <button
                  type="button"
                  onClick={handleAddExternalLink}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  <Youtube size={16} />
                  追加
                </button>
              </div>
              {externalLinkError && <p className="text-sm text-red-400">{externalLinkError}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {externalLinks.map((link) => (
                  <span
                    key={link.id}
                    className="flex items-center gap-2 bg-red-900/30 text-red-200 px-3 py-1 rounded-full text-xs border border-red-700/50"
                  >
                    <Youtube size={12} />
                    {link.url.length > 40 ? `${link.url.substring(0, 40)}...` : link.url}
                    <button onClick={() => removeExternalLink(link.id)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                YouTubeなどの外部リンクを追加できます。複数のリンクを追加可能です。
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
              {isSubmitting ? (isEditMode ? '編集中...' : '投稿中...') : isEditMode ? '編集を保存' : '投稿する'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}


