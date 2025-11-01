'use client';

import React from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio: string; // "16/9", "1/1", "21/9" など
  sizes?: string;
  className?: string;
  overlayContent?: React.ReactNode;
  priority?: boolean;
}

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio,
  sizes,
  className = '',
  overlayContent,
  priority = false,
}: ResponsiveImageProps) {
  // アスペクト比を計算（例: "16/9" -> 16/9 = 1.777...）
  const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
  const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

  return (
    <div
      className={`responsive-image-container relative w-full overflow-hidden bg-gray-800 ${className}`}
      style={{ paddingBottom: paddingBottom }}
    >
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="responsive-image object-cover object-center"
        />
      </div>
      {overlayContent && (
        <div className="absolute inset-0 z-10">
          {overlayContent}
        </div>
      )}
    </div>
  );
}
