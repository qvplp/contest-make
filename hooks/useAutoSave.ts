'use client';

import { useEffect, useRef, useCallback } from 'react';
import { saveDraft, hasUnsavedChanges } from '@/utils/draftManager';

interface UseAutoSaveOptions {
  articleId: string;
  title: string;
  excerpt: string;
  content: string;
  enabled?: boolean;
  debounceMs?: number;
  intervalMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

/**
 * content ベースのシンプルなオートセーブフック
 */
export function useAutoSave({
  articleId,
  title,
  excerpt,
  content,
  enabled = true,
  debounceMs = 1500,
  intervalMs = 10000,
  onSaveSuccess,
  onSaveError,
}: UseAutoSaveOptions) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const performSave = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;
    isSavingRef.current = true;

    try {
      saveDraft(articleId, {
        title,
        excerpt,
        content,
        thumbnailPreview: null,
        citedGuides: [],
      });
      onSaveSuccess?.();
    } catch (error) {
      console.error('Auto-save failed:', error);
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [articleId, title, excerpt, content, enabled, onSaveSuccess, onSaveError]);

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
  }, [title, excerpt, content, enabled, debounceMs, performSave]);

  // 定期的な保存
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

  const saveNow = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave();
  }, [performSave]);

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
    hasUnsavedChanges: hasUnsavedChanges(articleId, { title, excerpt, content }),
  };
}

