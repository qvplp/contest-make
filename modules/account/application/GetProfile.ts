import type { ProfileRepository } from '../domain/Profile';

export class GetProfile {
  constructor(private readonly profiles: ProfileRepository) {}

  execute() {
    return this.profiles.get();
  }
}

