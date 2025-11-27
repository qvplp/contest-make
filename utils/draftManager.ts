/**
 * 下書き管理ユーティリティ（content ベース版）
 */

export interface ArticleDraft {
  articleId: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailPreview: string | null;
  citedGuides: import('@/types/guideForm').CitedGuide[];
  updatedAt: string;
}

export interface ArticleSettings {
  articleId: string;
  category: string;
  classifications: string[];
  aiModels: string[];
  tags: string[];
  contestTag: string;
  updatedAt: string;
}

const DRAFT_PREFIX = 'guide_draft_';
const SETTINGS_PREFIX = 'guide_settings_';

/**
 * 下書きを保存（localStorage）
 */
export function saveDraft(
  articleId: string,
  draft: Omit<ArticleDraft, 'articleId' | 'updatedAt'>
): void {
  if (typeof window === 'undefined') return;

  const data: ArticleDraft = {
    ...draft,
    articleId,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`${DRAFT_PREFIX}${articleId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw error;
  }
}

/**
 * 下書きを取得
 */
export function getDraft(articleId: string): ArticleDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${articleId}`);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // 旧形式（sections 配列）を使っている場合は無視して新規作成させる
    if (parsed.sections && !parsed.content) {
      return null;
    }

    return parsed as ArticleDraft;
  } catch (error) {
    console.error('Failed to get draft:', error);
    return null;
  }
}

/**
 * 下書きを削除
 */
export function deleteDraft(articleId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${DRAFT_PREFIX}${articleId}`);
}

/**
 * 記事設定を保存
 */
export function saveArticleSettings(
  articleId: string,
  settings: Omit<ArticleSettings, 'articleId' | 'updatedAt'>
): void {
  if (typeof window === 'undefined') return;

  const data: ArticleSettings = {
    ...settings,
    articleId,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`${SETTINGS_PREFIX}${articleId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save article settings:', error);
    throw error;
  }
}

/**
 * 記事設定を取得
 */
export function getArticleSettings(articleId: string): ArticleSettings | null {
  if (typeof window === 'undefined') return null;

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
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${SETTINGS_PREFIX}${articleId}`);
}

/**
 * 全下書き一覧（デバッグ・一覧用）
 */
export function getAllDrafts(): ArticleDraft[] {
  if (typeof window === 'undefined') return [];

  const drafts: ArticleDraft[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(DRAFT_PREFIX)) {
      const articleId = key.replace(DRAFT_PREFIX, '');
      const draft = getDraft(articleId);
      if (draft) drafts.push(draft);
    }
  }

  return drafts.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * 未保存の変更があるかどうか（シンプル版）
 */
export function hasUnsavedChanges(
  articleId: string,
  currentData: { title: string; excerpt: string; content: string }
): boolean {
  const draft = getDraft(articleId);
  if (!draft) {
    return (
      currentData.title.trim() !== '' ||
      currentData.excerpt.trim() !== '' ||
      currentData.content.trim() !== ''
    );
  }

  return (
    draft.title !== currentData.title ||
    draft.excerpt !== currentData.excerpt ||
    draft.content !== currentData.content
  );
}

