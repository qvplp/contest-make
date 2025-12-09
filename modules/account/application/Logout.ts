import type { AuthRepository } from '../domain/AuthRepository';

export class Logout {
  constructor(private readonly auth: AuthRepository) {}

  execute() {
    this.auth.clear();
    return { success: true as const };
  }
}

