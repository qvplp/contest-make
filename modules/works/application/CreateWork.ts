import type { WorkRepository, WorkIdGenerator, WorkClock } from '../domain/WorkRepository';
import type { Work, CreateWorkInput } from '../domain/Work';

type Dependencies = {
  works: WorkRepository;
  idGenerator: WorkIdGenerator;
  clock?: WorkClock;
};

export class CreateWork {
  private readonly clock: WorkClock;

  constructor(private readonly deps: Dependencies) {
    this.clock = deps.clock ?? { now: () => new Date().toISOString() };
  }

  execute(input: CreateWorkInput, author: { id: string; name: string; avatar?: string }) {
    if (!author.id) {
      return { success: false as const, error: 'ログインが必要です' };
    }

    const work: Work = {
      id: this.deps.idGenerator.generate(),
      title: input.title,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar || '/images/avatars/user1.jpg',
      mediaType: input.mediaType,
      mediaSource: input.mediaSource,
      summary: input.summary,
      classifications: input.classifications,
      aiModels: input.classifications.includes('AIモデル') ? input.aiModels : [],
      tags: input.tags,
      referencedGuideIds: input.referencedGuideIds,
      isHot: false,
      visibility: input.visibility,
      createdAt: this.clock.now(),
      stats: {
        likes: 0,
        comments: 0,
        views: 0,
      },
      externalLinks: input.externalLinks,
    };

    this.deps.works.save(work);

    return { success: true as const, work };
  }
}

