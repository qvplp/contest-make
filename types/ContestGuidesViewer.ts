/**
 * ContestGuidesViewerコンポーネントで使用する型定義
 */

export interface Guide {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export interface ContestGuidesViewerProps {
  guides: Guide[];
  contestSlug: string;
  contestDisplayName: string;
}

