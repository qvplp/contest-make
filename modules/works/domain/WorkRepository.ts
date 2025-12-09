import type { Work, CreateWorkInput } from './Work';

export interface WorkRepository {
  listByUser(userId: string): Work[];
  save(work: Work): void;
  update(workId: string, updater: (prev: Work) => Work): Work | null;
  toggleVisibility(workId: string): Work | null;
  submitToContest(workId: string, contestId: string): Work | null;
}

export interface WorkIdGenerator {
  generate(): string;
}

export interface WorkClock {
  now(): string;
}

export const defaultWorkClock: WorkClock = {
  now: () => new Date().toISOString(),
};

