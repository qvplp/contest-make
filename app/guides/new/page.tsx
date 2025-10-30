'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Upload, X, Check, Save, Eye, Cpu } from 'lucide-react';

type Classification = 'アニメ' | '漫画' | '実写' | 'カメラワーク' | 'ワークフロー' | 'AIモデル';

type AIModel =
  | 'GPT-5'
  | 'Sora2'
  | 'Seedream'
  | 'Seedance'
  | 'Dreamina'
  | 'Omnihuman'
  | 'Hotgen General'
  | 'Claude 4'
  | 'Midjourney v7'
  | 'DALL-E 4';

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  thumbnail: File | null;
  thumbnailPreview: string | null;
}

export default function NewGuidePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    classifications: [],
    aiModels: [],
    tags: [],
    thumbnail: null,
    thumbnailPreview: null,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'タイトルを入力してください';
    if (!formData.excerpt.trim()) newErrors.excerpt = '概要を入力してください';
    if (!formData.content.trim()) newErrors.content = '本文を入力してください';
    if (!formData.category) newErrors.category = 'カテゴリーを選択してください';
    if (formData.classifications.length === 0)
      newErrors.classifications = '少なくとも1つの分類を選択してください';
    if (formData.classifications.includes('AIモデル') && formData.aiModels.length === 0)
      newErrors.aiModels = 'AIモデル分類を選択した場合、少なくとも1つのモデルを選択してください';
    if (!formData.thumbnail) newErrors.thumbnail = 'サムネイル画像をアップロードしてください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/guides');
    }, 2000);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="bg-gray-950 min-h-screen py-8">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">攻略記事を投稿</h1>
          <p className="text-gray-400">あなたの知識を共有して、コミュニティに貢献しましょう</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <label className="block font-semibold mb-3">
                本文 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="記事の本文を入力してください。マークダウン形式で ## を使って見出しを作成できます。"
                rows={20}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none font-mono text-sm"
              />
              {errors.content && <p className="text-red-400 text-sm mt-2">{errors.content}</p>}
            </div>
          </div>

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

            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Eye size={20} />
                プレビュー
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
    </div>
  );
}


