import type { ContestInfo, ContestScheduleStatus } from '../domain/Contest';

export interface ContestQueryService {
  getBySlug(slug: string): ContestInfo | undefined;
  getActive(): ContestInfo[];
  getAll(): ContestInfo[];
  getScheduleStatus(contest: ContestInfo): ContestScheduleStatus;
}

