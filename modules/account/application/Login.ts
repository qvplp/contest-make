import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

export class Login {
  constructor(private readonly auth: AuthRepository) {}

  execute(user: User) {
    this.auth.save(user);
    return { success: true as const };
  }
}

