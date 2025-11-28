'use client';

import Image from 'next/image';
import React from 'react';

interface WorkMediaPreviewProps {
  mediaType: 'image' | 'video';
  src: string;
  aspectRatio?: string; // e.g. "1/1"
  sizes?: string;
  className?: string;
  overlayContent?: React.ReactNode;
  priority?: boolean;
  showVideoControls?: boolean;
  autoPlayVideo?: boolean;
  mutedVideo?: boolean;
}

export default function WorkMediaPreview({
  mediaType,
  src,
  aspectRatio = '1/1',
  sizes,
  className = '',
  overlayContent,
  priority = false,
  showVideoControls = false,
  autoPlayVideo = false,
  mutedVideo = true,
}: WorkMediaPreviewProps) {
  const [widthRatio, heightRatio] = aspectRatio.split('/').map(Number);
  const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

  return (
    <div
      className={`relative w-full overflow-hidden bg-gray-800 rounded-lg ${className}`}
      style={{ paddingBottom }}
    >
      <div className="absolute inset-0">
        {mediaType === 'image' ? (
          <Image
            src={src}
            alt="work-media"
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover object-center"
            unoptimized={src.startsWith('data:')}
          />
        ) : (
          <video
            src={src}
            className="w-full h-full object-cover"
            controls={showVideoControls}
            autoPlay={autoPlayVideo}
            loop={autoPlayVideo}
            muted={mutedVideo}
            playsInline
            preload="metadata"
          />
        )}
      </div>
      {overlayContent && <div className="absolute inset-0 z-10">{overlayContent}</div>}
    </div>
  );
}


