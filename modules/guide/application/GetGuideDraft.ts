import type { GuideDraftRepository } from '../domain/GuideDraft';

export class GetGuideDraft {
  constructor(private readonly drafts: GuideDraftRepository) {}

  execute(articleId: string) {
    return this.drafts.findById(articleId);
  }
}

