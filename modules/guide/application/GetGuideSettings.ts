import type { GuideSettingsRepository } from '../domain/GuideSettings';

export class GetGuideSettings {
  constructor(private readonly settings: GuideSettingsRepository) {}

  execute(articleId: string) {
    return this.settings.findById(articleId);
  }
}

