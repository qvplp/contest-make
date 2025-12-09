import type { AuthRepository } from '../domain/AuthRepository';

export class GetCurrentUser {
  constructor(private readonly auth: AuthRepository) {}

  execute() {
    return this.auth.getCurrentUser();
  }
}

