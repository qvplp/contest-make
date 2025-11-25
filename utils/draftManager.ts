/**
 * 下書き管理ユーティリティ
 */

export interface Section {
  id: string;
  title: string;
  body_md: string;
  is_published: boolean;
  order: number;
}

export interface ArticleDraft {
  id: string;
  title: string;
  sections: Section[];
  updated_at: string;
  version: number;
  excerpt?: string; // 概要（オプショナル、後方互換性のため）
  thumbnailPreview?: string; // サムネイルプレビュー（base64、オプショナル）
  citedGuides?: import('@/types/guideForm').CitedGuide[]; // 引用した記事（オプショナル）
}

export interface DraftHistory {
  version: number;
  timestamp: string;
  title: string;
  sectionsCount: number;
  diffSummary?: string;
}

const DRAFT_PREFIX = 'draft:';
const HISTORY_PREFIX = 'history:';
const SETTINGS_PREFIX = 'settings:';
const MAX_HISTORY = 5;

/**
 * 下書きを保存（localStorage）
 */
export function saveDraft(articleId: string, draft: Omit<ArticleDraft, 'id' | 'version'>): void {
  if (typeof window === 'undefined') return; // SSR対応
  
  try {
    const existing = getDraft(articleId);
    const version = existing ? existing.version + 1 : 1;

    const fullDraft: ArticleDraft = {
      id: articleId,
      ...draft,
      version,
    };

    localStorage.setItem(`${DRAFT_PREFIX}${articleId}`, JSON.stringify(fullDraft));

    // 履歴を保存
    saveDraftHistory(articleId, fullDraft);
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw error;
  }
}

/**
 * 下書きを取得
 */
export function getDraft(articleId: string): ArticleDraft | null {
  if (typeof window === 'undefined') return null; // SSR対応
  
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${articleId}`);
    if (!stored) return null;
    return JSON.parse(stored) as ArticleDraft;
  } catch (error) {
    console.error('Failed to get draft:', error);
    return null;
  }
}

/**
 * 下書きを削除
 */
export function deleteDraft(articleId: string): void {
  if (typeof window === 'undefined') return; // SSR対応
  
  localStorage.removeItem(`${DRAFT_PREFIX}${articleId}`);
  localStorage.removeItem(`${HISTORY_PREFIX}${articleId}`);
}

/**
 * 下書き履歴を保存
 */
function saveDraftHistory(articleId: string, draft: ArticleDraft): void {
  if (typeof window === 'undefined') return; // SSR対応
  
  try {
    const histories = getDraftHistories(articleId);
    const newHistory: DraftHistory = {
      version: draft.version,
      timestamp: draft.updated_at,
      title: draft.title,
      sectionsCount: draft.sections.length,
    };

    // 最新版を先頭に追加
    const updated = [newHistory, ...histories].slice(0, MAX_HISTORY);

    localStorage.setItem(`${HISTORY_PREFIX}${articleId}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save draft history:', error);
  }
}

/**
 * 下書き履歴を取得
 */
export function getDraftHistories(articleId: string): DraftHistory[] {
  if (typeof window === 'undefined') return []; // SSR対応
  
  try {
    const stored = localStorage.getItem(`${HISTORY_PREFIX}${articleId}`);
    if (!stored) return [];
    return JSON.parse(stored) as DraftHistory[];
  } catch (error) {
    console.error('Failed to get draft histories:', error);
    return [];
  }
}

/**
 * 特定バージョンの下書きを復元
 */
export function restoreDraftVersion(articleId: string, version: number): ArticleDraft | null {
  // 簡易実装：最新版のみ保持しているため、履歴から復元はできない
  // 実際の実装では、各バージョンを個別に保存する必要がある
  const current = getDraft(articleId);
  if (current && current.version === version) {
    return current;
  }
  return null;
}

/**
 * データのハッシュを計算（差分検出用）
 */
export function calculateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * 未保存の変更があるかチェック
 */
export function hasUnsavedChanges(
  articleId: string,
  currentData: {
    title: string;
    sections: Section[];
    excerpt?: string;
    thumbnailPreview?: string;
    citedGuides?: import('@/types/guideForm').CitedGuide[];
  }
): boolean {
  const draft = getDraft(articleId);
  if (!draft) {
    // 下書きがなく、データがある場合は未保存
    return (
      currentData.title.trim() !== '' ||
      currentData.sections.length > 0 ||
      (currentData.excerpt?.trim() ?? '') !== '' ||
      (currentData.citedGuides?.length ?? 0) > 0
    );
  }

  const currentHash = calculateHash(JSON.stringify({
    title: currentData.title,
    sections: currentData.sections,
    excerpt: currentData.excerpt ?? '',
    thumbnailPreview: currentData.thumbnailPreview ?? '',
    citedGuides: currentData.citedGuides ?? [],
  }));
  const draftHash = calculateHash(JSON.stringify({
    title: draft.title,
    sections: draft.sections,
    excerpt: draft.excerpt ?? '',
    thumbnailPreview: draft.thumbnailPreview ?? '',
    citedGuides: draft.citedGuides ?? [],
  }));

  return currentHash !== draftHash;
}

/**
 * 新しいセクションIDを生成
 */
export function generateSectionId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 記事設定情報の型定義
 */
export interface ArticleSettings {
  category: string;
  classifications: string[];
  aiModels: string[];
  tags: string[];
  contestTag: string;
}

/**
 * 記事設定を保存
 */
export function saveArticleSettings(articleId: string, settings: ArticleSettings): void {
  if (typeof window === 'undefined') return; // SSR対応
  
  try {
    localStorage.setItem(`${SETTINGS_PREFIX}${articleId}`, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save article settings:', error);
    throw error;
  }
}

/**
 * 記事設定を取得
 */
export function getArticleSettings(articleId: string): ArticleSettings | null {
  if (typeof window === 'undefined') return null; // SSR対応
  
  try {
    const stored = localStorage.getItem(`${SETTINGS_PREFIX}${articleId}`);
    if (!stored) return null;
    return JSON.parse(stored) as ArticleSettings;
  } catch (error) {
    console.error('Failed to get article settings:', error);
    return null;
  }
}

/**
 * 記事設定を削除
 */
export function deleteArticleSettings(articleId: string): void {
  if (typeof window === 'undefined') return; // SSR対応
  
  localStorage.removeItem(`${SETTINGS_PREFIX}${articleId}`);
}

