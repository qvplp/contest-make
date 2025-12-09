import type { ContestInfo } from '@/modules/contest/domain/Contest';
import type { Work } from '@/modules/works/domain/Work';

export type JudgableContest = ContestInfo & {
  scheduleStatus: 'upcoming' | 'submission' | 'review' | 'announcement' | 'ended';
};

export type JudgingWork = Work & {
  votes: number;
  isNominated: boolean;
  nominatedCategory?: string;
};

export type Nomination = {
  workId: string;
  category: string;
  nominatedAt: string;
  nominatedBy: string;
};

export type CategoryNominations = {
  category: string;
  works: JudgingWork[];
};

