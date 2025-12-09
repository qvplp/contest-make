import type { WorkRepository } from '../domain/WorkRepository';
import type { CreateWorkInput } from '../domain/Work';

type Dependencies = {
  works: WorkRepository;
};

export class UpdateWork {
  constructor(private readonly deps: Dependencies) {}

  execute(workId: string, authorId: string, input: CreateWorkInput) {
    if (!authorId) {
      return { success: false as const, error: 'ログインが必要です' };
    }

    const updated = this.deps.works.update(workId, (existing) => {
      if (existing.authorId !== authorId) {
        throw new Error('権限がありません');
      }

      return {
        ...existing,
        title: input.title,
        summary: input.summary,
        mediaType: input.mediaType,
        mediaSource: input.mediaSource,
        classifications: input.classifications,
        aiModels: input.classifications.includes('AIモデル') ? input.aiModels : [],
        tags: input.tags,
        referencedGuideIds: input.referencedGuideIds,
        visibility: input.visibility,
        externalLinks: input.externalLinks,
      };
    });

    if (!updated) {
      return { success: false as const, error: '作品が見つかりません' };
    }

    return { success: true as const };
  }
}

