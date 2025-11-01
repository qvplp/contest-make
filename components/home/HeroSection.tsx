'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  title: string;
  description: string;
  cta?: {
    text: string;
    link: string;
  };
}

interface HeroSectionProps {
  slides: HeroSlide[];
  autoPlayInterval?: number; // ミリ秒（デフォルト: 10000 = 10秒）
}

const HeroSection: React.FC<HeroSectionProps> = ({
  slides,
  autoPlayInterval = 10000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 次のスライドへ
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300); // フェード時間
  }, [slides.length]);

  // 前のスライドへ
  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  }, [slides.length]);

  // 特定のスライドへ
  const goToSlide = useCallback((index: number) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentIndex]);

  // 自動再生
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, slides.length]);

  const currentSlide = slides[currentIndex];

  if (slides.length === 0) {
    return <div className="w-full h-[400px] bg-gray-900" />;
  }

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
      {/* 背景画像/動画 */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {currentSlide.type === 'image' ? (
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt || currentSlide.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={currentIndex === 0}
            quality={90}
          />
        ) : (
          <video
            src={currentSlide.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          />
        )}
        
        {/* オーバーレイ（グラデーション） */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* コンテンツ */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          {/* テキストカード */}
          <div
            className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* タイトル */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
              {currentSlide.title}
            </h1>
            
            {/* 説明文 */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
              {currentSlide.description}
            </p>
            
            {/* CTAボタン */}
            {currentSlide.cta && (
              <Link
                href={currentSlide.cta.link}
                className="inline-flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base lg:text-lg font-bold rounded-full transition-all hover:scale-105 shadow-lg"
              >
                {currentSlide.type === 'video' && (
                  <Play size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="currentColor" />
                )}
                <span>{currentSlide.cta.text}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン（モバイルでは非表示） */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
        </>
      )}

      {/* インジケーター */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;

