import type { User } from './User';

export interface AuthRepository {
  getCurrentUser(): User | null;
  save(user: User): void;
  clear(): void;
}

