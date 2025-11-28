import { AIModel, Classification } from './guideForm';

export type WorkMediaType = 'image' | 'video';
export type WorkVisibility = 'public' | 'private';

export interface WorkStats {
  likes: number;
  comments: number;
  views: number;
}

export interface Work {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  mediaType: WorkMediaType;
  mediaSource: string;
  summary: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  referencedGuideIds: string[];
  isHot: boolean;
  visibility: WorkVisibility;
  createdAt: string;
  stats: WorkStats;
  contestId?: string;
}

export interface CreateWorkInput {
  title: string;
  summary: string;
  mediaType: WorkMediaType;
  mediaSource: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  visibility: WorkVisibility;
  referencedGuideIds: string[];
}


