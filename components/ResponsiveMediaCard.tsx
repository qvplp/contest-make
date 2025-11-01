'use client';

import React from 'react';
import ResponsiveImage from './ResponsiveImage';
import { Play } from 'lucide-react';

interface ResponsiveMediaCardProps {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | '3/4' | '9/16';
  className?: string;
  overlay?: React.ReactNode;
  onClick?: () => void;
}

const ResponsiveMediaCard: React.FC<ResponsiveMediaCardProps> = ({
  type,
  src,
  alt = '',
  aspectRatio = '16/9',
  className = '',
  overlay,
  onClick,
}) => {
  return (
    <div
      className={`group cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      onClick={onClick}
    >
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="rounded-lg"
        overlayContent={
          <>
            {/* 動画の場合は再生ボタンを表示 */}
            {type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="text-gray-900" fill="currentColor" size={24} />
                </div>
              </div>
            )}
            
            {/* カスタムオーバーレイ */}
            {overlay}
          </>
        }
      />
    </div>
  );
};

export default ResponsiveMediaCard;

