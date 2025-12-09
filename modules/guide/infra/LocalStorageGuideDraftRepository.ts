import type { GuideDraft, GuideDraftRepository } from '../domain/GuideDraft';

const DRAFT_PREFIX = 'guide_draft_';

export class LocalStorageGuideDraftRepository implements GuideDraftRepository {
  save(draft: GuideDraft): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${DRAFT_PREFIX}${draft.id}`, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  }

  findById(id: string): GuideDraft | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`${DRAFT_PREFIX}${id}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed.sections && !parsed.content) {
        return null;
      }
      return parsed as GuideDraft;
    } catch (error) {
      console.error('Failed to get draft:', error);
      return null;
    }
  }

  delete(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
  }

  list(): GuideDraft[] {
    if (typeof window === 'undefined') return [];
    const drafts: GuideDraft[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(DRAFT_PREFIX)) {
        const articleId = key.replace(DRAFT_PREFIX, '');
        const draft = this.findById(articleId);
        if (draft) drafts.push(draft);
      }
    }
    return drafts.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

