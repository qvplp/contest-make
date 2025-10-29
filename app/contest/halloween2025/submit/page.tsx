'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Play,
  FileVideo,
  Image as ImageIcon,
  Trophy,
} from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  categories: string[];
  division: string;
  file: File | null;
  filePreview: string | null;
  fileType: 'image' | 'video' | null;
}

export default function SubmitPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    categories: [],
    division: '',
    file: null,
    filePreview: null,
    fileType: null,
  });

  const [isDragging, setIsDragging] = useState(false);
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

  // ファイルハンドリング
  const handleFileChange = (file: File) => {
    const maxSize = 300 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: '対応ファイル形式: JPEG, PNG, GIF, MP4',
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: 'ファイルサイズは300MB以下にしてください',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';
      setFormData((prev) => ({
        ...prev,
        file,
        filePreview: e.target?.result as string,
        fileType,
      }));
      setErrors((prev) => {
        const { file, ...rest } = prev;
        return rest;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    if (!formData.file) {
      newErrors.file = 'ファイルをアップロードしてください';
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
    setIsSubmitting(true);
    
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
                <li>• 作品の70%以上がSousaku.AIで作成されていること</li>
                <li>• 動画は10秒〜5分、最大300MB</li>
                <li>• 音声はオリジナルまたはライセンス取得済みであること</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 space-y-6">
          <div>
            <label className="block font-semibold mb-3 text-lg">
              作品ファイル <span className="text-red-500">*</span>
            </label>
            
            {!formData.file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-purple-500 bg-purple-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg font-semibold mb-2">
                  このパネルをクリックして、mp4形式の動画（10秒〜5分、最大300MB）をアップロードしてください。
                </p>
                <p className="text-sm text-gray-400">
                  対応形式: JPEG, PNG, GIF, MP4
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="bg-black rounded-xl overflow-hidden">
                  {formData.fileType === 'image' ? (
                    <div className="aspect-video relative">
                      <Image
                        src={formData.filePreview!}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <video
                      src={formData.filePreview!}
                      controls
                      className="w-full aspect-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      file: null,
                      filePreview: null,
                      fileType: null,
                    }))
                  }
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-lg transition"
                >
                  <X size={20} />
                </button>

                <div className="mt-4 flex items-center gap-3 text-sm text-gray-300">
                  {formData.fileType === 'image' ? (
                    <ImageIcon size={16} />
                  ) : (
                    <FileVideo size={16} />
                  )}
                  <span>{formData.file.name}</span>
                  <span className="text-gray-500">
                    ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
            
            {errors.file && (
              <p className="text-red-400 text-sm mt-2">{errors.file}</p>
            )}
          </div>

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

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
            >
              <Trophy size={24} />
              送信
            </button>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">応募内容の確認</h2>
            
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

