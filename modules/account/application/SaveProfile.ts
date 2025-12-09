import type { ProfileRepository, Profile } from '../domain/Profile';

export class SaveProfile {
  constructor(private readonly profiles: ProfileRepository) {}

  execute(profile: Profile) {
    this.profiles.save(profile);
    return { success: true as const };
  }
}

