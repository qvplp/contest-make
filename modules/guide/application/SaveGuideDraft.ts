import type { GuideDraftRepository } from '../domain/GuideDraft';
import type { CitedGuide } from '../domain/GuideReference';

export type SaveGuideDraftInput = {
  articleId: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailPreview: string | null;
  citedGuides: CitedGuide[];
};

export class SaveGuideDraft {
  constructor(private readonly drafts: GuideDraftRepository) {}

  execute(input: SaveGuideDraftInput) {
    this.drafts.save({
      id: input.articleId,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      thumbnailPreview: input.thumbnailPreview,
      citedGuides: input.citedGuides,
      updatedAt: new Date().toISOString(),
    });
  }
}

