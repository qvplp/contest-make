import type { AIModel, Classification } from './GuideTaxonomy';

export type GuideSettings = {
  articleId: string;
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  contestTag: string;
  updatedAt: string;
};

export interface GuideSettingsRepository {
  save(settings: GuideSettings): void;
  findById(articleId: string): GuideSettings | null;
  delete(articleId: string): void;
}

