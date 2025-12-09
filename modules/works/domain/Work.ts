export type WorkMediaType = 'image' | 'video';
export type WorkVisibility = 'public' | 'private';

export type WorkStats = {
  likes: number;
  comments: number;
  views: number;
};

export type ExternalLink = {
  id: string;
  type: 'youtube' | 'vimeo' | 'nicovideo' | 'other';
  url: string;
  title?: string;
};

export type Work = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  mediaType: WorkMediaType;
  mediaSource: string;
  summary: string;
  classifications: string[];
  aiModels: string[];
  tags: string[];
  referencedGuideIds: string[];
  isHot: boolean;
  visibility: WorkVisibility;
  createdAt: string;
  stats: WorkStats;
  contestId?: string;
  externalLinks?: ExternalLink[];
};

export type CreateWorkInput = {
  title: string;
  summary: string;
  mediaType: WorkMediaType;
  mediaSource: string;
  classifications: string[];
  aiModels: string[];
  tags: string[];
  visibility: WorkVisibility;
  referencedGuideIds: string[];
  externalLinks?: ExternalLink[];
};

