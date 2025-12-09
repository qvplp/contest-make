export type UserRole = 'user' | 'judge' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
};

