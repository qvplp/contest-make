import { AIModel, Classification } from './guideForm';

export type WorkMediaType = 'image' | 'video';
export type WorkVisibility = 'public' | 'private';

export interface WorkStats {
  likes: number;
  comments: number;
  views: number;
}

/**
 * 外部リンク情報
 */
export interface ExternalLink {
  id: string;
  type: 'youtube' | 'vimeo' | 'nicovideo' | 'other';
  url: string;
  title?: string; // オプション: リンクのタイトル
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
  // 外部リンク（YouTubeなど）
  externalLinks?: ExternalLink[];
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
  externalLinks?: ExternalLink[];
}


