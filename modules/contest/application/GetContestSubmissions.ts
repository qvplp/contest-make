import type { ContestSubmissionRepository } from '../domain/ContestSubmission';

export class GetContestSubmissions {
  constructor(private readonly repository: ContestSubmissionRepository) {}

  execute(contestSlug: string) {
    return this.repository.listByContest(contestSlug);
  }
}

