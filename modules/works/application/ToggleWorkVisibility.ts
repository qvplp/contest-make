import type { WorkRepository } from '../domain/WorkRepository';

type Dependencies = { works: WorkRepository };

export class ToggleWorkVisibility {
  constructor(private readonly deps: Dependencies) {}

  execute(workId: string) {
    const updated = this.deps.works.toggleVisibility(workId);
    if (!updated) {
      return { success: false as const, error: '作品が見つかりません' };
    }
    return { success: true as const, work: updated };
  }
}

