'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Edit,
  ThumbsUp,
  MessageCircle,
  Eye,
  Calendar,
  User,
  Tag,
  Cpu,
  Youtube,
  Link2,
  FileVideo,
  Image as ImageIcon,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { Work } from '@/types/works';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';
import WorkSubmitModal from './WorkSubmitModal';
import { extractYouTubeVideoId } from '@/utils/externalLinks';

interface WorkViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: Work | null;
}

export default function WorkViewerModal({ isOpen, onClose, work }: WorkViewerModalProps) {
  const { user } = useAuth();
  const { userWorks } = useWorks();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentWork, setCurrentWork] = useState<Work | null>(work);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsEditModalOpen(false);
      setCurrentWork(work);
    } else {
      setCurrentWork(work);
    }
  }, [isOpen, work]);

  // 編集後に最新の作品データを取得
  useEffect(() => {
    if (currentWork && user?.id === currentWork.authorId) {
      const updatedWork = userWorks.find((w) => w.id === currentWork.id);
      if (updatedWork) {
        setCurrentWork(updatedWork);
      }
    }
  }, [userWorks, currentWork, user]);

  // 早期リターン: currentWorkがnullの場合は何も表示しない
  if (!isMounted || !isOpen || !currentWork || typeof window === 'undefined') {
    return null;
  }

  const isOwner = user?.id === currentWork.authorId;
  const isGif = currentWork.mediaSource.toLowerCase().endsWith('.gif');
  const isVideo = currentWork.mediaType === 'video';
  const shouldAutoPlay = isVideo;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    // 編集後はビュワーを閉じる（必要に応じて再読み込み）
    onClose();
  };

  return (
    <>
      {isMounted && typeof window !== 'undefined' && document.body && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
          <div className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={currentWork.authorAvatar}
                      alt={currentWork.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{currentWork.authorName}</p>
                    <p className="text-xs text-gray-400">{formatDate(currentWork.createdAt)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isOwner && (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                  >
                    <Edit size={18} />
                    編集
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-800 transition"
                  aria-label="閉じる"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-6">
              {/* メディアセクション */}
              <div className="space-y-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="relative">
                    <WorkMediaPreview
                      mediaType={currentWork.mediaType}
                      src={currentWork.mediaSource}
                      aspectRatio="16/9"
                      className="rounded-xl"
                      showVideoControls={shouldAutoPlay}
                      autoPlayVideo={shouldAutoPlay}
                      mutedVideo={shouldAutoPlay}
                    />
                    {isGif && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                        GIF
                      </div>
                    )}
                    {work.mediaType === 'video' && !isGif && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <FileVideo size={12} />
                        動画
                      </div>
                    )}
                  </div>
                </div>

                {/* 統計情報 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-around">
                    <div className="flex items-center gap-2 text-gray-300">
                      <ThumbsUp size={18} />
                      <span className="font-semibold">{currentWork.stats.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MessageCircle size={18} />
                      <span className="font-semibold">{currentWork.stats.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Eye size={18} />
                      <span className="font-semibold">{currentWork.stats.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 情報セクション */}
              <div className="space-y-4">
                {/* タイトル */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentWork.title}</h2>
                  {currentWork.summary && (
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{currentWork.summary}</p>
                  )}
                </div>

                {/* 分類 */}
                {currentWork.classifications.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-purple-400" />
                      <span className="text-sm font-semibold text-gray-400">分類</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentWork.classifications.map((classification) => (
                        <span
                          key={classification}
                          className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-700/50"
                        >
                          {classification}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AIモデル */}
                {currentWork.aiModels.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={16} className="text-cyan-400" />
                      <span className="text-sm font-semibold text-gray-400">使用AIモデル</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentWork.aiModels.map((model) => (
                        <span
                          key={model}
                          className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full text-sm border border-cyan-700/50"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* タグ */}
                {currentWork.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-400">タグ</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentWork.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 外部リンク */}
                {currentWork.externalLinks && currentWork.externalLinks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Youtube size={16} className="text-red-500" />
                      <span className="text-sm font-semibold text-gray-400">外部リンク</span>
                    </div>
                    <div className="space-y-2">
                      {currentWork.externalLinks.map((link) => {
                        const videoId = link.type === 'youtube' ? extractYouTubeVideoId(link.url) : null;
                        const embedUrl =
                          link.type === 'youtube' && videoId
                            ? `https://www.youtube.com/embed/${videoId}`
                            : null;

                        return (
                          <div key={link.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                            {embedUrl ? (
                              <div className="aspect-video rounded-lg overflow-hidden mb-2">
                                <iframe
                                  src={embedUrl}
                                  title={link.title || 'YouTube動画'}
                                  className="w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
                              >
                                <Youtube size={16} />
                                <span className="text-sm truncate">{link.url}</span>
                                <Link2 size={14} />
                              </a>
                            )}
                            {link.title && (
                              <p className="text-xs text-gray-400 mt-1">{link.title}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 公開設定（自分の作品のみ） */}
                {isOwner && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-400">公開設定</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          currentWork.visibility === 'public'
                            ? 'bg-green-900/40 text-green-300 border border-green-700/50'
                            : 'bg-gray-700 text-gray-300 border border-gray-600'
                        }`}
                      >
                        {currentWork.visibility === 'public' ? '公開' : '非公開'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 参考にした攻略記事 */}
                {currentWork.referencedGuideIds && currentWork.referencedGuideIds.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-400">参考にした攻略記事</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentWork.referencedGuideIds.map((guideId) => (
                        <a
                          key={guideId}
                          href={`/guides/${guideId}`}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700 hover:border-purple-600 hover:text-purple-300 transition"
                        >
                          {guideId}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* 編集モーダル */}
      {isOwner && (
        <WorkSubmitModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          workToEdit={currentWork}
          onEditSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}

