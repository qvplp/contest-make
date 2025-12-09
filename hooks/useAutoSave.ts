'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMemo } from 'react';
import { SaveGuideDraft } from '@/modules/guide/application/SaveGuideDraft';
import { GetGuideDraft } from '@/modules/guide/application/GetGuideDraft';
import { LocalStorageGuideDraftRepository } from '@/modules/guide/infra/LocalStorageGuideDraftRepository';

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
  const draftRepo = useMemo(() => new LocalStorageGuideDraftRepository(), []);
  const saveDraft = useMemo(() => new SaveGuideDraft(draftRepo), [draftRepo]);
  const getDraft = useMemo(() => new GetGuideDraft(draftRepo), [draftRepo]);

  const performSave = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;
    isSavingRef.current = true;

    try {
      saveDraft.execute({
        articleId,
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
    hasUnsavedChanges: (() => {
      const draft = getDraft.execute(articleId);
      if (!draft) {
        return (
          title.trim() !== '' ||
          excerpt.trim() !== '' ||
          content.trim() !== ''
        );
      }
      return (
        draft.title !== title ||
        draft.excerpt !== excerpt ||
        draft.content !== content
      );
    })(),
  };
}

