'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import ContestSection from '@/components/home/ContestSection';
import GuidesSection from '@/components/home/GuidesSection';
import WorksSection from '@/components/home/WorksSection';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-gray-400">ログインページへ移動しています...</p>
      </div>
    );
  }

  // ヒーロースライドデータ
  const heroSlides = [
    {
      id: 1,
      type: 'image' as const,
      src: '/images/contests/halloween2025.jpg',
      alt: 'AI動画生成の新時代',
      title: 'AI動画生成の新時代',
      description: 'テキストから映画レベルの動画を数分で生成',
      cta: {
        text: '今すぐ始める',
        link: '/contest/halloween2025/submit',
      },
    },
    {
      id: 2,
      type: 'image' as const,
      src: '/images/banners/halloween2025.jpg',
      alt: 'コンテスト開催中',
      title: 'コンテスト開催中',
      description: 'ハロウィンカップ2025に参加して、豪華賞品をゲット',
      cta: {
        text: 'コンテストを見る',
        link: '/contest/halloween2025',
      },
    },
    {
      id: 3,
      type: 'image' as const,
      src: '/images/banners/halloween2025.jpg',
      alt: '攻略ガイドでスキルアップ',
      title: '攻略ガイドでスキルアップ',
      description: 'プロのテクニックを学んで、作品をレベルアップ',
      cta: {
        text: '攻略を見る',
        link: '/guides',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ヒーローセクション */}
      <HeroSection 
        slides={heroSlides}
        autoPlayInterval={10000}
      />
      
      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* コンテストセクション */}
        <ContestSection />
        
        {/* 攻略セクション */}
        <GuidesSection />
        
        {/* 作品セクション */}
        <WorksSection />
      </div>
    </div>
  );
}
