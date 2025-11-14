'use client';

import { useEffect, useRef, useCallback } from 'react';
import { saveDraft, hasUnsavedChanges, calculateHash, Section } from '@/utils/draftManager';

interface UseAutoSaveOptions {
  articleId: string;
  title: string;
  sections: Section[];
  excerpt?: string;
  thumbnailPreview?: string;
  citedGuides?: import('@/types/guideForm').CitedGuide[];
  enabled?: boolean;
  debounceMs?: number;
  intervalMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useAutoSave({
  articleId,
  title,
  sections,
  excerpt,
  thumbnailPreview,
  citedGuides,
  enabled = true,
  debounceMs = 1500,
  intervalMs = 10000,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) {
  const lastSavedHashRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const performSave = useCallback(async () => {
    if (isSavingRef.current) return;

    const currentHash = calculateHash(JSON.stringify({
      title,
      sections,
      excerpt: excerpt ?? '',
      thumbnailPreview: thumbnailPreview ?? '',
      citedGuides: citedGuides ?? [],
    }));
    if (currentHash === lastSavedHashRef.current) {
      return; // 変更がない場合は保存しない
    }

    isSavingRef.current = true;

    try {
      saveDraft(articleId, {
        title,
        sections,
        excerpt,
        thumbnailPreview,
        citedGuides,
        updated_at: new Date().toISOString(),
      });

      lastSavedHashRef.current = currentHash;
      retryCountRef.current = 0;
      onSaveSuccess?.();
    } catch (error) {
      console.error('Auto-save failed:', error);
      retryCountRef.current += 1;

      if (retryCountRef.current < maxRetries) {
        // 指数的バックオフ
        const backoffDelay = Math.pow(2, retryCountRef.current) * 1000;
        setTimeout(() => {
          isSavingRef.current = false;
          performSave();
        }, backoffDelay);
      } else {
        isSavingRef.current = false;
        onSaveError?.(error as Error);
      }
      return;
    }

    isSavingRef.current = false;
  }, [articleId, title, sections, excerpt, thumbnailPreview, citedGuides, onSaveSuccess, onSaveError]);

  // デバウンス保存（入力停止後）
  useEffect(() => {
    if (!enabled) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [title, sections, excerpt, thumbnailPreview, citedGuides, enabled, debounceMs, performSave]);

  // 定期的な保存（10秒間隔）
  useEffect(() => {
    if (!enabled) return;

    intervalTimerRef.current = setInterval(() => {
      performSave();
    }, intervalMs);

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [enabled, intervalMs, performSave]);

  // 明示的な保存関数
  const saveNow = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave();
  }, [performSave]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, []);

  return {
    saveNow,
    hasUnsavedChanges: hasUnsavedChanges(articleId, {
      title,
      sections,
      excerpt,
      thumbnailPreview,
      citedGuides,
    }),
  };
}

