'use client';

import { useEffect, useState } from 'react';
import { CitedGuideCard } from './CitedGuideCard';
import {
  getCitedGuidesInfo,
  type CitedGuideInfo,
} from '@/lib/mockCitedGuides';

interface CitedGuidesSectionProps {
  guideIds: string[];
}

export function CitedGuidesSection({ guideIds }: CitedGuidesSectionProps) {
  const [guides, setGuides] = useState<CitedGuideInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!guideIds || guideIds.length === 0) {
      setGuides([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    getCitedGuidesInfo(guideIds)
      .then((data) => {
        if (cancelled) return;
        setGuides(data);
      })
      .catch(() => {
        if (cancelled) return;
        setHasError(true);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [guideIds]);

  if (!guideIds || guideIds.length === 0) return null;
  if (!isLoading && !hasError && guides.length === 0) return null;

  return (
    <section className="mb-12 pt-8 border-t border-gray-800">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        📚 引用した記事
      </h3>

      {hasError && (
        <p className="text-sm text-red-400 mb-4">
          引用した記事情報の取得中にエラーが発生しました。
        </p>
      )}

      {isLoading && guides.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/60 h-40"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((guide) => (
            <CitedGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    </section>
  );
}



