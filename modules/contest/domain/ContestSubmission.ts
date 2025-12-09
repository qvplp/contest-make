export type ContestSubmission = {
  id: number;
  title: string;
  author: string;
  imageUrl: string;
  videoUrl?: string;
  votes: number;
  views: number;
  categories: string[];
  division: string;
  createdAt: string;
  description: string;
  isVideo: boolean;
  hasVoted?: boolean;
};

export interface ContestSubmissionRepository {
  listByContest(slug: string): ContestSubmission[];
  toggleVote(slug: string, submissionId: number): ContestSubmission[];
}

