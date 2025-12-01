'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import {
  X,
  Check,
  AlertCircle,
  Trophy,
  Search,
  Play,
  FileVideo,
  Image as ImageIcon,
} from 'lucide-react';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';

interface FormData {
  selectedWorkId: string | null;
  title: string;
  description: string;
  categories: string[];
  division: string;
}

export default function SubmitPage() {
  const { isLoggedIn } = useAuth();
  const { userWorks, submitWorkToContest } = useWorks();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    selectedWorkId: null,
    title: '',
    description: '',
    categories: [],
    division: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
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

  const selectedWork = useMemo(() => {
    if (!formData.selectedWorkId) return null;
    return userWorks.find((work) => work.id === formData.selectedWorkId) || null;
  }, [userWorks, formData.selectedWorkId]);

  // 作品選択時にタイトルと説明を自動入力
  useEffect(() => {
    if (selectedWork) {
      setFormData((prev) => ({
        ...prev,
        title: prev.title || selectedWork.title,
        description: prev.description || selectedWork.summary,
      }));
    }
  }, [selectedWork]);

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

    if (!formData.selectedWorkId) {
      newErrors.selectedWorkId = '作品を選択してください';
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
    if (!formData.selectedWorkId) return;

    setIsSubmitting(true);

    // 作品をコンテストに応募
    const result = submitWorkToContest(formData.selectedWorkId, 'halloween2025');

    if (!result.success) {
      setErrors({ submit: result.error || '応募に失敗しました' });
      setIsSubmitting(false);
      setShowConfirmModal(false);
      return;
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
                <li>• 動画は10秒〜5分、最大300MB</li>
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
                  {availableWorks.map((work) => (
                    <button
                      key={work.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedWorkId: prev.selectedWorkId === work.id ? null : work.id,
                        }))
                      }
                      className={`relative rounded-lg overflow-hidden border-2 transition ${
                        formData.selectedWorkId === work.id
                          ? 'border-purple-600 ring-2 ring-purple-600'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <WorkMediaPreview
                        mediaType={work.mediaType}
                        src={work.mediaSource}
                        aspectRatio="16/9"
                        className="rounded-none"
                      />
                      {formData.selectedWorkId === work.id && (
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
                  ))}
                </div>
                {errors.selectedWorkId && (
                  <p className="text-red-400 text-sm mt-2">{errors.selectedWorkId}</p>
                )}
              </>
            )}
          </div>

          {/* 選択された作品のプレビュー */}
          {selectedWork && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-4">選択された作品</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden">
                  <WorkMediaPreview
                    mediaType={selectedWork.mediaType}
                    src={selectedWork.mediaSource}
                    aspectRatio="16/9"
                    showVideoControls={selectedWork.mediaType === 'video'}
                    autoPlayVideo={false}
                    mutedVideo={true}
                  />
                  {selectedWork.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-black/70 rounded-full flex items-center justify-center">
                        <Play className="text-white" fill="white" size={24} />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{selectedWork.title}</h4>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {selectedWork.summary || '説明なし'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedWork.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      {selectedWork.mediaType === 'video' ? (
                        <FileVideo size={14} />
                      ) : (
                        <ImageIcon size={14} />
                      )}
                      {selectedWork.mediaType === 'video' ? '動画' : '画像'}
                    </span>
                    {selectedWork.visibility === 'private' && (
                      <span className="text-yellow-400">非公開</span>
                    )}
                  </div>
                </div>
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
              disabled={!formData.selectedWorkId}
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
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">応募内容の確認</h2>

            {selectedWork && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">選択された作品</p>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="font-semibold">{selectedWork.title}</p>
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
