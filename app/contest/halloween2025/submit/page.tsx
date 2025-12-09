'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import type { ExternalLink } from '@/modules/works/domain/Work';
import { validateExternalLink } from '@/utils/externalLinks';
import {
  X,
  Check,
  AlertCircle,
  Trophy,
  Search,
  FileVideo,
  Image as ImageIcon,
  Youtube,
} from 'lucide-react';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';
import { StaticContestQueryService } from '@/modules/contest/infra/StaticContestQueryService';

interface FormData {
  selectedWorkIds: string[];
  title: string;
  description: string;
  categories: string[];
  division: string;
  externalLinks: ExternalLink[];
}

export default function SubmitPage() {
  const { isLoggedIn } = useAuth();
  const { userWorks, submitWorkToContest } = useWorks();
  const router = useRouter();
  const contestQuery = useMemo(() => new StaticContestQueryService(), []);
  const contest = contestQuery.getBySlug('halloween2025');
  const submissionSettings = contest?.submissionSettings || {
    allowedFormats: ['all'],
    maxVideoFiles: 3,
    maxVideoTotalSizeMB: 10,
    allowedExternalLinkTypes: ['youtube'],
    maxExternalLinks: 10,
    maxSelectedWorks: 1,
  };

  const [formData, setFormData] = useState<FormData>({
    selectedWorkIds: [],
    title: '',
    description: '',
    categories: [],
    division: '',
    externalLinks: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [externalLinkInput, setExternalLinkInput] = useState('');
  const [externalLinkError, setExternalLinkError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const categories = [
    '最優秀ハロウィン雰囲気賞',
    '最優秀キャラクター賞',
    '最優秀アニメーション賞',
    '最優秀ホラー演出賞',
  ];

  const divisions = ['イラスト', 'アニメ短編'];

  // 投稿済み作品をフィルタリング（公開・非公開問わず）
  const availableWorks = useMemo(() => {
    return userWorks.filter((work) => {
      if (searchQuery.trim() === '') return true;
      const query = searchQuery.toLowerCase();
      return (
        work.title.toLowerCase().includes(query) ||
        work.summary.toLowerCase().includes(query) ||
        work.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [userWorks, searchQuery]);

  const selectedWorks = useMemo(() => {
    return userWorks.filter((work) => formData.selectedWorkIds.includes(work.id));
  }, [userWorks, formData.selectedWorkIds]);

  // 作品選択時にタイトルと説明を自動入力（最初の作品のみ）
  useEffect(() => {
    if (selectedWorks.length > 0 && !formData.title) {
      const firstWork = selectedWorks[0];
      setFormData((prev) => ({
        ...prev,
        title: prev.title || firstWork.title,
        description: prev.description || firstWork.summary,
      }));
    }
  }, [selectedWorks]);

  const toggleWorkSelection = (workId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedWorkIds.includes(workId);
      const newSelectedIds = isSelected
        ? prev.selectedWorkIds.filter((id) => id !== workId)
        : [...prev.selectedWorkIds, workId];

      // 最大選択数のチェック
      if (!isSelected && newSelectedIds.length > submissionSettings.maxSelectedWorks) {
        setErrors((prev) => ({
          ...prev,
          selectedWorkIds: `作品は最大${submissionSettings.maxSelectedWorks}件まで選択可能です`,
        }));
        return prev;
      }

      // エラーをクリア
      setErrors((prev) => {
        const { selectedWorkIds, ...rest } = prev;
        return rest;
      });

      return {
        ...prev,
        selectedWorkIds: newSelectedIds,
      };
    });
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleAddExternalLink = () => {
    const trimmed = externalLinkInput.trim();
    if (!trimmed) {
      setExternalLinkError('URLを入力してください');
      return;
    }

    // 外部リンクのバリデーション
    const validation = validateExternalLink(trimmed, submissionSettings.allowedExternalLinkTypes);
    if (!validation.valid || !validation.type) {
      setExternalLinkError(validation.error || '有効なURLを入力してください');
      return;
    }

    // 最大数チェック
    if (formData.externalLinks.length >= submissionSettings.maxExternalLinks) {
      setExternalLinkError(`外部リンクは最大${submissionSettings.maxExternalLinks}個まで追加可能です`);
      return;
    }

    // 重複チェック
    if (formData.externalLinks.some((link) => link.url === trimmed)) {
      setExternalLinkError('同じURLがすでに追加されています');
      return;
    }

    const newLink: ExternalLink = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `link_${Date.now()}`,
      type: validation.type,
      url: trimmed,
    };

    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, newLink],
    }));
    setExternalLinkInput('');
    setExternalLinkError(null);
  };

  const removeExternalLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((link) => link.id !== id),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 投稿済み作品の選択が必須
    if (formData.selectedWorkIds.length === 0) {
      newErrors.selectedWorkIds = '投稿済み作品を1つ以上選択してください';
    }

    // 最大選択数のチェック
    if (formData.selectedWorkIds.length > submissionSettings.maxSelectedWorks) {
      newErrors.selectedWorkIds = `作品は最大${submissionSettings.maxSelectedWorks}件まで選択可能です`;
    }

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルを入力してください';
    }

    if (!formData.description.trim()) {
      newErrors.description = '作品の説明を入力してください';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = '少なくとも1つのカテゴリーを選択してください';
    }

    if (!formData.division) {
      newErrors.division = '作品部門を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    if (formData.selectedWorkIds.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // 複数の作品をコンテストに応募
    for (const workId of formData.selectedWorkIds) {
      const result = submitWorkToContest(workId, 'halloween2025');
      if (!result.success) {
        setErrors({ submit: result.error || '応募に失敗しました' });
        setIsSubmitting(false);
        setShowConfirmModal(false);
        return;
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        router.push('/contest/halloween2025/vote');
      }, 3000);
    }, 2000);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">作品を応募する</h1>
          <p className="text-gray-400">
            ハロウィン創作カップ2025に作品を応募しましょう！
          </p>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6 mb-8">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold mb-2">応募前の確認事項</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• オリジナル作品であること</li>
                <li>• 作品の70%以上がAnimeHubで作成されていること</li>
                <li>• 投稿済み作品から最大{submissionSettings.maxSelectedWorks}件まで選択可能</li>
                <li>• 音声はオリジナルまたはライセンス取得済みであること</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 space-y-6">
          {/* 作品選択セクション */}
          <div>
            <label className="block font-semibold mb-3 text-lg">
              応募する作品を選択 <span className="text-red-500">*</span>
              {submissionSettings.maxSelectedWorks > 1 && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  （最大{submissionSettings.maxSelectedWorks}件まで選択可）
                </span>
              )}
            </label>

            {availableWorks.length === 0 ? (
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-12 text-center">
                <p className="text-gray-400 mb-4">
                  投稿済みの作品がありません
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  作品を投稿する →
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="作品を検索..."
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
                  {availableWorks.map((work) => {
                    const isSelected = formData.selectedWorkIds.includes(work.id);
                    const isMaxReached = formData.selectedWorkIds.length >= submissionSettings.maxSelectedWorks;
                    const canSelect = isSelected || !isMaxReached;
                    return (
                      <button
                        key={work.id}
                        onClick={() => toggleWorkSelection(work.id)}
                        disabled={!canSelect}
                        className={`relative rounded-lg overflow-hidden border-2 transition ${
                          isSelected
                            ? 'border-purple-600 ring-2 ring-purple-600'
                            : canSelect
                              ? 'border-gray-700 hover:border-gray-600'
                              : 'border-gray-700 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <WorkMediaPreview
                          mediaType={work.mediaType}
                          src={work.mediaSource}
                          aspectRatio="16/9"
                          className="rounded-none"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1.5">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 hover:opacity-100 transition">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                              {work.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              {work.mediaType === 'video' ? (
                                <FileVideo size={12} />
                              ) : (
                                <ImageIcon size={12} />
                              )}
                              <span>{work.mediaType === 'video' ? '動画' : '画像'}</span>
                              {work.visibility === 'private' && (
                                <span className="text-yellow-400">非公開</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.selectedWorkIds.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {formData.selectedWorkIds.length}/{submissionSettings.maxSelectedWorks}件の作品を選択中
                  </p>
                )}
                {errors.selectedWorkIds && (
                  <p className="text-red-400 text-sm mt-2">{errors.selectedWorkIds}</p>
                )}
              </>
            )}
          </div>

          {/* 外部リンクセクション */}
          <div>
            <label className="block font-semibold mb-3 text-lg flex items-center gap-2">
              <Youtube className="text-red-500" size={20} />
              YouTubeリンク <span className="text-sm font-normal text-gray-400">（任意、最大{submissionSettings.maxExternalLinks}個）</span>
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
                placeholder="YouTube URL（例: https://www.youtube.com/watch?v=...）"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={formData.externalLinks.length >= submissionSettings.maxExternalLinks}
              />
              <button
                type="button"
                onClick={handleAddExternalLink}
                disabled={formData.externalLinks.length >= submissionSettings.maxExternalLinks}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Youtube size={16} />
                追加
              </button>
            </div>
            {externalLinkError && <p className="text-sm text-red-400 mb-2">{externalLinkError}</p>}
            {formData.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.externalLinks.map((link) => (
                  <span
                    key={link.id}
                    className="flex items-center gap-2 bg-red-900/30 text-red-200 px-3 py-2 rounded-lg text-sm border border-red-700/50"
                  >
                    <Youtube size={14} />
                    {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                    <button
                      onClick={() => removeExternalLink(link.id)}
                      className="ml-1 hover:text-red-400 transition"
                      aria-label="削除"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 選択された作品のプレビュー */}
          {selectedWorks.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-4">選択された作品 ({selectedWorks.length}件)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedWorks.map((work) => (
                  <div key={work.id} className="flex gap-3">
                    <div className="relative rounded-lg overflow-hidden flex-shrink-0 w-24 h-24">
                      <WorkMediaPreview
                        mediaType={work.mediaType}
                        src={work.mediaSource}
                        aspectRatio="1/1"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">{work.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{work.summary || '説明なし'}</p>
                    </div>
                    <button
                      onClick={() => toggleWorkSelection(work.id)}
                      className="text-gray-400 hover:text-red-400 transition"
                      aria-label="選択解除"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-3">
              作品タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="例: おばけハロウィン"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-3">
              作品の説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="作品のコンセプトや見どころを教えてください"
              rows={5}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-3">
              応募したい賞 <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-400 ml-2">
                （複数選択可）
              </span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    formData.categories.includes(category)
                      ? 'border-purple-600 bg-purple-900/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    {formData.categories.includes(category) && (
                      <Check className="text-purple-400" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="text-red-400 text-sm mt-2">{errors.categories}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-3">
              作品部門 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {divisions.map((division) => (
                <button
                  key={division}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, division }))
                  }
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    formData.division === division
                      ? 'border-purple-600 bg-purple-900/30'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{division}</span>
                    {formData.division === division && (
                      <Check className="text-purple-400" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {errors.division && (
              <p className="text-red-400 text-sm mt-2">{errors.division}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={formData.selectedWorkIds.length === 0}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
            >
              <Trophy size={24} />
              応募する
            </button>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">応募内容の確認</h2>

            {selectedWorks.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">選択された作品 ({selectedWorks.length}件)</p>
                <div className="space-y-2">
                  {selectedWorks.map((work) => (
                    <div key={work.id} className="bg-gray-800 rounded-lg p-3">
                      <p className="font-semibold text-sm">{work.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.externalLinks.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">外部リンク ({formData.externalLinks.length}個)</p>
                <div className="space-y-2">
                  {formData.externalLinks.map((link) => (
                    <div key={link.id} className="bg-gray-800 rounded-lg p-3">
                      <p className="font-semibold text-sm truncate">{link.url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-400">タイトル</p>
                <p className="font-semibold">{formData.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">応募する賞</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">作品部門</p>
                <p className="font-semibold">{formData.division}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              この内容で応募してよろしいですか？
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    送信中...
                  </>
                ) : (
                  '応募する'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功モーダル */}
      {submitSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">応募完了！</h2>
            <p className="text-gray-400 mb-6">
              作品の応募が完了しました。<br />
              投票画面へ移動します...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}
