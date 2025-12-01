'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CitedGuideCard } from './CitedGuideCard';
import { getCitedGuideInfo, type CitedGuideInfo } from '@/lib/mockCitedGuides';

function extractGuideId(input: string): string | null {
  const patterns = [
    /(?:https?:\/\/[^/]+)?\/guides\/([a-zA-Z0-9_-]+)/,
    /^\/guides\/([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface CitedGuideUrlInputProps {
  existingIds: string[];
  onAdd: (guide: CitedGuideInfo) => void;
}

export function CitedGuideUrlInput({
  existingIds,
  onAdd,
}: CitedGuideUrlInputProps) {
  const [url, setUrl] = useState('');
  const [previewGuide, setPreviewGuide] = useState<CitedGuideInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value: string) => {
    setUrl(value);
    setError(null);
    setPreviewGuide(null);
  };

  const handleFetch = async () => {
    const id = extractGuideId(url);
    if (!id) {
      setError('有効な記事URLまたはIDを入力してください');
      setPreviewGuide(null);
      return;
    }

    if (existingIds.includes(id)) {
      setError('この記事はすでに引用リストに追加されています');
      setPreviewGuide(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setPreviewGuide(null);

    try {
      const info = await getCitedGuideInfo(id);
      if (!info) {
        setError('該当する記事が見つかりませんでした');
        return;
      }
      setPreviewGuide(info);
    } catch {
      setError('記事情報の取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!previewGuide) return;
    onAdd(previewGuide);
    setUrl('');
    setPreviewGuide(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          記事URLを貼り付け
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleFetch}
          placeholder="https://animehub.com/guides/guide-001 など"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                   text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
            {error}
          </p>
        )}
      </div>

      {isLoading && (
        <div className="text-sm text-gray-400">記事情報を取得しています...</div>
      )}

      {previewGuide && (
        <div className="bg-gray-900/70 rounded-xl border border-gray-700 p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <CitedGuideCard guide={previewGuide} />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2 text-sm font-semibold"
          >
            <Plus size={16} />
            追加する
          </button>
        </div>
      )}
    </div>
  );
}



