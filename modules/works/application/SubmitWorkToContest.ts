import type { WorkRepository } from '../domain/WorkRepository';

type Dependencies = { works: WorkRepository };

export class SubmitWorkToContest {
  constructor(private readonly deps: Dependencies) {}

  execute(workId: string, authorId: string, contestId: string) {
    if (!authorId) {
      return { success: false as const, error: 'ログインが必要です' };
    }

    const updated = this.deps.works.submitToContest(workId, contestId);
    if (!updated) {
      return { success: false as const, error: '作品が見つかりません' };
    }
    if (updated.authorId !== authorId) {
      return { success: false as const, error: 'この作品を編集する権限がありません' };
    }

    return { success: true as const };
  }
}

