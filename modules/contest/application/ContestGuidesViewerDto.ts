export type ContestGuide = {
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
  contestTag?: string;
};

export type ContestGuidesViewerProps = {
  guides: ContestGuide[];
  contestSlug: string;
  contestDisplayName: string;
};

