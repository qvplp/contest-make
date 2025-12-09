'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Play, ThumbsUp, Eye, Flame, PlusCircle } from 'lucide-react';
import { useWorks } from '@/contexts/WorksContext';
import { Work } from '@/modules/works/domain/Work';
import WorkSubmitModal from '@/components/works/WorkSubmitModal';
import WorkMediaPreview from '@/components/works/WorkMediaPreview';
import WorkViewerModal from '@/components/works/WorkViewerModal';

const defaultWorks = [
  {
    id: '1',
    mediaSrc: '/images/samples/sample1.jpg',
    title: 'ハロウィンの魔女',
    mediaType: 'video' as const,
    likes: 1234,
    views: 5678,
    isHot: true,
  },
  {
    id: '2',
    mediaSrc: '/images/samples/sample2.jpg',
    title: 'ダンスするかぼちゃ',
    mediaType: 'image' as const,
    likes: 890,
    views: 3456,
    isHot: false,
  },
  {
    id: '3',
    mediaSrc: '/images/samples/sample3.jpg',
    title: 'リアルなお化け屋敷',
    mediaType: 'video' as const,
    likes: 1567,
    views: 6789,
    isHot: true,
  },
  {
    id: '4',
    mediaSrc: '/images/samples/sample4.jpg',
    title: '幻想的な魔法陣',
    mediaType: 'image' as const,
    likes: 723,
    views: 2345,
    isHot: false,
  },
  {
    id: '5',
    mediaSrc: '/images/samples/sample5.jpg',
    title: 'ホラー映画のようなシーン',
    mediaType: 'video' as const,
    likes: 2100,
    views: 8901,
    isHot: true,
  },
  {
    id: '6',
    mediaSrc: '/images/samples/sample6.jpg',
    title: '漫画風のハロウィンキャラ',
    mediaType: 'image' as const,
    likes: 567,
    views: 1876,
    isHot: false,
  },
  {
    id: '7',
    mediaSrc: '/images/samples/sample7.jpg',
    title: 'スチームパンクなハロウィン',
    mediaType: 'image' as const,
    likes: 1234,
    views: 4567,
    isHot: false,
  },
  {
    id: '8',
    mediaSrc: '/images/samples/sample8.jpg',
    title: 'ダンスパーティーの動画',
    mediaType: 'video' as const,
    likes: 2345,
    views: 9876,
    isHot: true,
  },
];

const WorksSection: React.FC = () => {
  const { userWorks } = useWorks();
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const userWorkCards = useMemo(
    () =>
      userWorks
        .filter((work) => work.visibility === 'public')
        .map((work) => ({
          id: work.id,
          mediaSrc: work.mediaSource,
          title: work.title,
          mediaType: work.mediaType,
          likes: work.stats.likes,
          views: work.stats.views,
          isHot: work.isHot,
        })),
    [userWorks],
  );

  const combinedWorks = [...userWorkCards, ...defaultWorks];

  const filteredWorks =
    activeTab === 'hot'
      ? combinedWorks.filter((work) => work.isHot)
      : activeTab === 'new'
      ? combinedWorks.slice(0, 6)
      : combinedWorks;

  // 作品をWork型に変換する関数
  const convertToWork = (work: typeof filteredWorks[0]): Work | null => {
    // userWorksから該当する作品を探す
    const userWork = userWorks.find((w) => w.id === work.id);
    if (userWork) {
      return userWork;
    }

    // defaultWorksの場合はWork型に変換
    return {
      id: work.id,
      title: work.title,
      authorId: 'unknown',
      authorName: 'ユーザー',
      authorAvatar: '/images/avatars/user1.jpg',
      mediaType: work.mediaType,
      mediaSource: work.mediaSrc,
      summary: '',
      classifications: [],
      aiModels: [],
      tags: [],
      referencedGuideIds: [],
      isHot: work.isHot,
      visibility: 'public',
      createdAt: new Date().toISOString(),
      stats: {
        likes: work.likes,
        comments: 0,
        views: work.views,
      },
    };
  };

  const handleWorkClick = (work: typeof filteredWorks[0]) => {
    const convertedWork = convertToWork(work);
    if (convertedWork) {
      setSelectedWork(convertedWork);
      setIsViewerOpen(true);
    }
  };

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          🎨 みんなの投稿作品
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition text-sm"
          >
            <PlusCircle size={18} />
            作品を投稿
          </button>
          <Link
            href="/contest-posts"
            className="text-sm sm:text-base text-purple-400 hover:text-purple-300 font-medium transition-colors whitespace-nowrap"
          >
            すべて見る →
          </Link>
        </div>
      </div>

      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold transition text-sm"
        >
          <PlusCircle size={18} />
          作品を投稿
        </button>
      </div>

      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-2">
        {['all', 'hot', 'new', 'popular'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tab === 'all' && 'すべて'}
            {tab === 'hot' && '🔥 HOT'}
            {tab === 'new' && '✨ 新着'}
            {tab === 'popular' && '⭐ 人気'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {filteredWorks.map((work) => (
          <button
            key={work.id}
            type="button"
            onClick={() => handleWorkClick(work)}
            className="relative group cursor-pointer w-full text-left"
          >
              <WorkMediaPreview
                mediaType={work.mediaType}
                src={work.mediaSrc}
                aspectRatio="1/1"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                className="group-hover:ring-2 group-hover:ring-purple-600 transition-all"
                overlayContent={
                  <>
                    {work.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/90 transition-colors">
                          <Play className="text-white" fill="white" size={20} />
                        </div>
                      </div>
                    )}
                    {work.isHot && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-orange-600 to-red-600 rounded text-xs font-bold flex items-center gap-1">
                        <Flame size={12} />
                        HOT
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                        <h3 className="text-white font-semibold text-xs sm:text-sm mb-2 line-clamp-2">
                          {work.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {work.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {work.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                }
              />
          </button>
        ))}
      </div>

      <WorkSubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <WorkViewerModal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedWork(null);
        }}
        work={selectedWork}
      />
    </section>
  );
};

export default WorksSection;

