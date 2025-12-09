import type { Profile, ProfileRepository } from '../domain/Profile';

const STORAGE_KEY = 'animehub_profile';

export class LocalStorageProfileRepository implements ProfileRepository {
  get(): Profile | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as Profile;
    } catch {
      return null;
    }
  }

  save(profile: Profile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

