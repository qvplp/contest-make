'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CitedGuideInfo } from '@/lib/mockCitedGuides';

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

interface CitedGuideCardProps {
  guide: CitedGuideInfo;
}

export function CitedGuideCard({ guide }: CitedGuideCardProps) {
  const title = truncateText(guide.title, 20);
  const authorName = truncateText(guide.author.name, 10);
  const published = formatDate(guide.publishedAt);

  const thumbnailSrc =
    guide.thumbnailUrl ??
    'https://images.pinyogram.com/Screenshot%202025-11-26%20at%2015.05.05.png';

  const avatarSrc =
    guide.author.avatarUrl ??
    '/images/avatars/default.png';

  return (
    <Link
      href={`/guides/${guide.id}`}
      className="group flex flex-col rounded-xl border border-gray-700 bg-gray-900/60 overflow-hidden hover:border-purple-500 hover:bg-gray-900 transition duration-150"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-800">
        <Image
          src={thumbnailSrc}
          alt={guide.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 px-4 py-3">
        <h4 className="text-sm font-semibold text-white leading-snug">
          {title}
        </h4>
        <div className="flex items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700 shrink-0">
              <Image
                src={avatarSrc}
                alt={guide.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="truncate">{authorName}</span>
          </div>
          {published && (
            <span className="shrink-0 text-[11px] text-gray-400">
              {published}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


