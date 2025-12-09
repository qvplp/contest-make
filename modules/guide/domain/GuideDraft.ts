import type { CitedGuide } from './GuideReference';

export type GuideDraft = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailPreview: string | null;
  citedGuides: CitedGuide[];
  updatedAt: string;
};

export interface GuideDraftRepository {
  save(draft: GuideDraft): void;
  findById(id: string): GuideDraft | null;
  delete(id: string): void;
  list(): GuideDraft[];
}

