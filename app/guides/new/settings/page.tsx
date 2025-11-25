'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Check,
  Cpu,
  Trophy,
  X,
  ArrowLeft,
  Save,
  Eye,
} from 'lucide-react';
import { AVAILABLE_CONTESTS } from '@/types/contests';
import MarkdownPreview from '@/components/editor/MarkdownPreview';
import {
  getDraft,
  getArticleSettings,
  saveArticleSettings,
} from '@/utils/draftManager';
import {
  Classification,
  AIModel,
  SettingsFormData,
} from '@/types/guideForm';

function GuideSettingsContent() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId') || '';

  const [formData, setFormData] = useState<SettingsFormData>({
    category: '',
    classifications: [],
    aiModels: [],
    tags: [],
    contestTag: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [draftData, setDraftData] = useState<{
    title: string;
    excerpt: string;
    thumbnailPreview: string | null;
    sections: import('@/utils/draftManager').Section[];
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!articleId) {
      router.push('/guides/new');
      return;
    }

    // 第1ページのデータを読み込む
    const draft = getDraft(articleId);
    if (!draft) {
      alert('記事データが見つかりません。最初からやり直してください。');
      router.push('/guides/new');
      return;
    }

    setDraftData({
      title: draft.title,
      excerpt: draft.excerpt ?? '',
      thumbnailPreview: draft.thumbnailPreview ?? null,
      sections: draft.sections,
    });

    // 既存の設定を読み込む
    const settings = getArticleSettings(articleId);
    if (settings) {
      setFormData({
        ...settings,
        classifications: settings.classifications as Classification[],
        aiModels: settings.aiModels as AIModel[],
      });
    }
  }, [isLoggedIn, router, articleId]);

  const categories = [
    'プロンプト技術',
    'モデル別攻略',
    'アニメーション',
    'エフェクト・演出',
    'オブジェクト制作',
    'キャラクターデザイン',
    'ポートレート',
    'ワークフロー',
  ];

  const classificationOptions: Classification[] = [
    'アニメ',
    '漫画',
    '実写',
    'カメラワーク',
    'ワークフロー',
    'AIモデル',
  ];

  const aiModelOptions: AIModel[] = [
    'GPT-5',
    'Sora2',
    'Seedream',
    'Seedance',
    'Dreamina',
    'Omnihuman',
    'Hotgen General',
    'Claude 4',
    'Midjourney v7',
    'DALL-E 4',
  ];

  const toggleClassification = (classification: Classification) => {
    setFormData((prev) => ({
      ...prev,
      classifications: prev.classifications.includes(classification)
        ? prev.classifications.filter((c) => c !== classification)
        : [...prev.classifications, classification],
    }));
  };

  const toggleAIModel = (model: AIModel) => {
    setFormData((prev) => ({
      ...prev,
      aiModels: prev.aiModels.includes(model)
        ? prev.aiModels.filter((m) => m !== model)
        : [...prev.aiModels, model],
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // セクションから本文を生成（公開されているセクションのみ）
  const generateContent = (): string => {
    if (!draftData) return '';
    return draftData.sections
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
    if (!formData.category) newErrors.category = 'カテゴリーを選択してください';
    if (formData.classifications.length === 0)
      newErrors.classifications = '少なくとも1つの分類を選択してください';
    if (formData.classifications.includes('AIモデル') && formData.aiModels.length === 0)
      newErrors.aiModels = 'AIモデル分類を選択した場合、少なくとも1つのモデルを選択してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    // 設定を保存
    saveArticleSettings(articleId, formData);

    setIsSubmitting(true);
    // 実際の実装では、ここでAPIに送信
    // const content = generateContent();
    // await submitArticle({ ...draftData, ...formData, content });
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/guides');
    }, 2000);
  };

  if (!isLoggedIn || !draftData) return null;

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <button
            onClick={() => router.push('/guides/new')}
            className="mb-4 text-purple-400 hover:text-purple-300 flex items-center gap-2 transition"
          >
            <ArrowLeft size={20} />
            戻る
          </button>
          <h1 className="text-4xl font-bold mb-2">投稿前の設定</h1>
          <p className="text-gray-400">カテゴリー、タグなどの設定を行ってください</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：プレビュー */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">記事プレビュー</h2>
              
              {draftData.thumbnailPreview && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={draftData.thumbnailPreview}
                    alt="サムネイル"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">{draftData.title}</h3>
                <p className="text-gray-400">{draftData.excerpt}</p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 max-h-96 overflow-y-auto">
                <MarkdownPreview markdown={generateContent()} />
              </div>
            </div>
          </div>

          {/* 右側：設定フォーム */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3">
                カテゴリー <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">選択してください</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-sm mt-2">{errors.category}</p>}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3">
                分類 <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-400 ml-2">（複数選択可）</span>
              </label>
              <div className="space-y-2">
                {classificationOptions.map((classification) => (
                  <button
                    key={classification}
                    onClick={() => toggleClassification(classification)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      formData.classifications.includes(classification)
                        ? 'border-purple-600 bg-purple-900/30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{classification}</span>
                      {formData.classifications.includes(classification) && (
                        <Check className="text-purple-400" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.classifications && <p className="text-red-400 text-sm mt-2">{errors.classifications}</p>}
            </div>

            {/* 利用可能AIモデル */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3">
                利用可能AIモデル
                {formData.classifications.includes('AIモデル') && <span className="text-red-500">*</span>}
                <span className="text-sm font-normal text-gray-400 ml-2">（複数選択可）</span>
              </label>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {aiModelOptions.map((model) => (
                  <button
                    key={model}
                    onClick={() => toggleAIModel(model)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      formData.aiModels.includes(model)
                        ? 'border-cyan-600 bg-cyan-900/30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu size={16} className="text-cyan-400" />
                        <span className="font-medium">{model}</span>
                      </div>
                      {formData.aiModels.includes(model) && <Check className="text-cyan-400" size={20} />}
                    </div>
                  </button>
                ))}
              </div>

              {formData.aiModels.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">選択中: {formData.aiModels.length}個</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.aiModels.map((model) => (
                      <span key={model} className="bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Cpu size={12} />
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {errors.aiModels && <p className="text-red-400 text-sm mt-2">{errors.aiModels}</p>}

              <p className="text-xs text-gray-500 mt-3">💡 この記事で使用または解説しているAIモデルを選択してください</p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3">タグ</label>
              <div className="flex gap-2 mb-3">
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
                  placeholder="タグを入力"
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                />
                <button onClick={addTag} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition">
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    #{tag}
                    <button onClick={() => removeTag(tag)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-400" />
                コンテストタグ
                <span className="text-sm font-normal text-gray-400">（任意）</span>
              </label>
              <p className="text-sm text-gray-400 mb-3">
                この記事が特定のコンテストに関連する場合、コンテストを選択してください。
              </p>
              <select
                value={formData.contestTag}
                onChange={(e) => setFormData((prev) => ({ ...prev, contestTag: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">コンテストを選択しない</option>
                {AVAILABLE_CONTESTS.map((contest) => (
                  <option key={contest.id} value={contest.displayName}>
                    {contest.title} ({contest.displayName})
                  </option>
                ))}
              </select>
              {formData.contestTag && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">選択中:</p>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">{formData.contestTag}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Eye size={20} />
                全体プレビュー
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    投稿中...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    投稿する
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 全体プレビューモーダル */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">プレビュー</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {draftData.thumbnailPreview && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src={draftData.thumbnailPreview}
                    alt="サムネイル"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{draftData.title}</h1>
                <p className="text-gray-400">{draftData.excerpt}</p>
              </div>
              <MarkdownPreview markdown={generateContent()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuideSettingsPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-950 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-400">読み込み中...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <GuideSettingsContent />
    </Suspense>
  );
}

