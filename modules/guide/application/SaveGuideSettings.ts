import type { GuideSettingsRepository } from '../domain/GuideSettings';
import type { AIModel, Classification } from '../domain/GuideTaxonomy';

export type SaveGuideSettingsInput = {
  articleId: string;
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  contestTag: string;
};

export class SaveGuideSettings {
  constructor(private readonly settings: GuideSettingsRepository) {}

  execute(input: SaveGuideSettingsInput) {
    this.settings.save({
      articleId: input.articleId,
      category: input.category,
      classifications: input.classifications,
      aiModels: input.aiModels,
      tags: input.tags,
      contestTag: input.contestTag,
      updatedAt: new Date().toISOString(),
    });
  }
}

