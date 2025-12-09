import { SaveGuideDraft } from '@/modules/guide/application/SaveGuideDraft';
import { GetGuideDraft } from '@/modules/guide/application/GetGuideDraft';
import { SaveGuideSettings } from '@/modules/guide/application/SaveGuideSettings';
import { GetGuideSettings } from '@/modules/guide/application/GetGuideSettings';
import { LocalStorageGuideDraftRepository } from '@/modules/guide/infra/LocalStorageGuideDraftRepository';
import { LocalStorageGuideSettingsRepository } from '@/modules/guide/infra/LocalStorageGuideSettingsRepository';
import type { GuideDraft } from '@/modules/guide/domain/GuideDraft';
import type { GuideSettings } from '@/modules/guide/domain/GuideSettings';
import type { CitedGuide } from '@/modules/guide/domain/GuideReference';

/**
 * 互換レイヤー: 既存の import を壊さずに modules/guide の実装へ委譲する
 */
const draftRepo = new LocalStorageGuideDraftRepository();
const settingsRepo = new LocalStorageGuideSettingsRepository();
const saveDraftUseCase = new SaveGuideDraft(draftRepo);
const getDraftUseCase = new GetGuideDraft(draftRepo);
const saveSettingsUseCase = new SaveGuideSettings(settingsRepo);
const getSettingsUseCase = new GetGuideSettings(settingsRepo);

export type ArticleDraft = GuideDraft & { citedGuides: CitedGuide[] };
export type ArticleSettings = GuideSettings;

export function saveDraft(
  articleId: string,
  draft: Omit<ArticleDraft, 'articleId' | 'id' | 'updatedAt'>
): void {
  saveDraftUseCase.execute({
    articleId,
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    thumbnailPreview: draft.thumbnailPreview,
    citedGuides: draft.citedGuides,
  });
}

export function getDraft(articleId: string): ArticleDraft | null {
  const result = getDraftUseCase.execute(articleId);
  return result ? { ...result, articleId: result.id } : null;
}

export function deleteDraft(articleId: string): void {
  draftRepo.delete(articleId);
}

export function saveArticleSettings(
  articleId: string,
  settings: Omit<ArticleSettings, 'articleId' | 'updatedAt'>
): void {
  saveSettingsUseCase.execute({
    articleId,
    category: settings.category,
    classifications: settings.classifications,
    aiModels: settings.aiModels,
    tags: settings.tags,
    contestTag: settings.contestTag,
  });
}

export function getArticleSettings(articleId: string): ArticleSettings | null {
  return getSettingsUseCase.execute(articleId);
}

export function deleteArticleSettings(articleId: string): void {
  settingsRepo.delete(articleId);
}

export function getAllDrafts(): ArticleDraft[] {
  return draftRepo.list().map((draft) => ({ ...draft, articleId: draft.id }));
}

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

