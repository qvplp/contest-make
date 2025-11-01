'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  type: 'image' | 'video';
  src: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export default function HeroSlider({ 
  slides, 
  autoPlayInterval = 10000 // デフォルト10秒
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 次のスライドへ
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 前のスライドへ
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 自動再生エフェクト
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    // クリーンアップ
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying, autoPlayInterval, slides.length]);

  // スライドが存在しない場合
  if (slides.length === 0) {
    return <div className="w-full h-[400px] bg-gray-900" />;
  }

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {/* 背景画像/動画 */}
      <div className="absolute inset-0">
        {slide.type === 'image' ? (
          <Image
            key={slide.id} // スライド切り替え時に再レンダリング
            src={slide.src}
            alt={slide.title}
            fill
            priority={currentSlide === 0} // 最初のスライドのみ優先読み込み
            sizes="100vw"
            className="object-cover object-center"
            style={{ objectPosition: 'center' }}
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
            style={{ objectPosition: 'center' }}
          />
        )}
      </div>

      {/* グラデーションオーバーレイ - 画像の上に重ねる */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* コンテンツ - カード風 */}
      <div className="relative h-full max-w-7xl mx-auto px-4 min-[480px]:px-6 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          {/* カード背景 - 半透明 + ブラー効果 */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 min-[480px]:p-8 sm:p-10 lg:p-12 border border-gray-700/50 shadow-2xl">
            {/* タイトル - レスポンシブサイズ */}
            <h1 className="text-3xl min-[480px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                {slide.title.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < slide.title.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </h1>

            {/* 説明文 - レスポンシブサイズ */}
            <p className="text-sm min-[480px]:text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed">
              {slide.description}
            </p>

            {/* CTAボタン - レスポンシブサイズ */}
            <Link href={slide.ctaLink}>
              <button className="px-6 min-[480px]:px-8 sm:px-10 py-3 min-[480px]:py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-white text-sm min-[480px]:text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 sm:gap-3 w-fit">
                <Play size={20} fill="white" />
                {slide.ctaText}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン（左） */}
      {slides.length > 1 && (
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000); // 5秒後に再開
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10"
          aria-label="前のスライド"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* ナビゲーションボタン（右） */}
      {slides.length > 1 && (
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 5000);
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10"
          aria-label="次のスライド"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* インジケーター */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
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
  );
}
