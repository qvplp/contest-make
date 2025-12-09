export type UserSocial = {
  twitter?: string;
  instagram?: string;
  portfolio?: string;
};

export type UserStats = {
  guidesCount: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

export type Profile = {
  id: string;
  username: string;
  userId: string;
  avatar: string;
  bio: string;
  social: UserSocial;
  stats: UserStats;
};

export interface ProfileRepository {
  get(): Profile | null;
  save(profile: Profile): void;
}

