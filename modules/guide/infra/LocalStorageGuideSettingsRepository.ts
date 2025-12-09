import type {
  GuideSettings,
  GuideSettingsRepository,
} from '../domain/GuideSettings';

const SETTINGS_PREFIX = 'guide_settings_';

export class LocalStorageGuideSettingsRepository
  implements GuideSettingsRepository
{
  save(settings: GuideSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${SETTINGS_PREFIX}${settings.articleId}`, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save article settings:', error);
      throw error;
    }
  }

  findById(articleId: string): GuideSettings | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`${SETTINGS_PREFIX}${articleId}`);
      if (!stored) return null;
      return JSON.parse(stored) as GuideSettings;
    } catch (error) {
      console.error('Failed to get article settings:', error);
      return null;
    }
  }

  delete(articleId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${SETTINGS_PREFIX}${articleId}`);
  }
}

