import type { ContestSubmissionRepository } from '../domain/ContestSubmission';

export class ToggleVoteForSubmission {
  constructor(private readonly repository: ContestSubmissionRepository) {}

  execute(contestSlug: string, submissionId: number) {
    return this.repository.toggleVote(contestSlug, submissionId);
  }
}

