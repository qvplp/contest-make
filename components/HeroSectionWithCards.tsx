'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  type: 'image' | 'video';
  src: string;
}

interface ContestBanner {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface ActionCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface HeroSectionWithCardsProps {
  slides: HeroSlide[];
  contestBanner: ContestBanner;
  actionCards: ActionCard[];
  autoPlayInterval?: number;
}

export default function HeroSectionWithCards({
  slides,
  contestBanner,
  actionCards,
  autoPlayInterval = 10000,
}: HeroSectionWithCardsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 自動スライド切り替え
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentSlide, autoPlayInterval, slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 min-[480px]:px-6 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* 左側: コンテストバナー + アクションカード */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            
            {/* コンテストバナー */}
            <Link href={contestBanner.link}>
              <div className="relative h-[180px] sm:h-[200px] rounded-2xl overflow-hidden group cursor-pointer">
                <Image
                  src={contestBanner.image}
                  alt={contestBanner.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* グラデーションオーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* タイトル */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {contestBanner.title}
                  </h3>
                </div>
              </div>
            </Link>

            {/* アクションカード */}
            <div className="space-y-3 sm:space-y-4">
              {actionCards.map((card) => (
                <Link key={card.id} href={card.link}>
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-5 hover:border-purple-600 hover:bg-gray-900/70 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{card.icon}</span>
                          <h4 className="text-base sm:text-lg font-bold text-white">
                            {card.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右側: ヒーロー画像/動画（スライドショー） */}
          <div className="lg:col-span-8">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gray-900">
              {/* 背景画像/動画 */}
              <div className="absolute inset-0">
                {slide.type === 'image' ? (
                  <Image
                    key={slide.id}
                    src={slide.src}
                    alt="ヒーロー画像"
                    fill
                    priority={currentSlide === 0}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <video
                    key={slide.id}
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                )}
              </div>

              {/* グラデーションオーバーレイ（軽め） */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* インジケーター（複数スライドの場合のみ） */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'w-8 sm:w-12 bg-white'
                          : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`スライド ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

