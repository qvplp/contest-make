import type { Work, CreateWorkInput } from '../domain/Work';
import type {
  WorkRepository,
  WorkIdGenerator,
  WorkClock,
} from '../domain/WorkRepository';

const DEFAULT_AVATAR = '/images/avatars/user1.jpg';

export class LocalStorageWorkRepository implements WorkRepository {
  constructor(
    private readonly storageKey: string,
    private readonly idGenerator: WorkIdGenerator,
    private readonly clock: WorkClock
  ) {}

  listByUser(_userId: string): Work[] {
    const raw = this.read();
    return raw.map(normalizeWork);
  }

  save(work: Work): void {
    const current = this.read();
    const next = [work, ...current];
    this.write(next);
  }

  update(workId: string, updater: (prev: Work) => Work): Work | null {
    const current = this.read();
    const idx = current.findIndex((w) => w.id === workId);
    if (idx === -1) return null;
    const updated = updater(current[idx]);
    const next = [...current];
    next[idx] = updated;
    this.write(next);
    return updated;
  }

  toggleVisibility(workId: string): Work | null {
    return this.update(workId, (prev) => ({
      ...prev,
      visibility: prev.visibility === 'public' ? 'private' : 'public',
    }));
  }

  submitToContest(workId: string, contestId: string): Work | null {
    return this.update(workId, (prev) => ({
      ...prev,
      contestId,
    }));
  }

  private read(): Work[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored) as Work[];
      return parsed.map(normalizeWork);
    } catch {
      return [];
    }
  }

  private write(works: Work[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(works));
  }
}

export class CryptoWorkIdGenerator implements WorkIdGenerator {
  generate(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `work_${Date.now()}`;
  }
}

export class SystemWorkClock implements WorkClock {
  now(): string {
    return new Date().toISOString();
  }
}

function normalizeWork(work: any): Work {
  const mediaSource =
    work.mediaSource || work.thumbnailUrl || work.mediaUrl || '/images/samples/sample1.jpg';

  return {
    id: work.id,
    title: work.title || '無題の作品',
    authorId: work.authorId || '',
    authorName: work.authorName || 'ユーザー',
    authorAvatar: work.authorAvatar || DEFAULT_AVATAR,
    mediaType: work.mediaType === 'video' ? 'video' : 'image',
    mediaSource,
    summary: work.summary || '',
    classifications: Array.isArray(work.classifications) ? work.classifications : [],
    aiModels: Array.isArray(work.aiModels) ? work.aiModels : [],
    tags: Array.isArray(work.tags) ? work.tags : [],
    referencedGuideIds: Array.isArray(work.referencedGuideIds) ? work.referencedGuideIds : [],
    isHot: Boolean(work.isHot),
    visibility: work.visibility === 'private' ? 'private' : 'public',
    createdAt: work.createdAt || new Date().toISOString(),
    stats: {
      likes: work.stats?.likes ?? 0,
      comments: work.stats?.comments ?? 0,
      views: work.stats?.views ?? 0,
    },
    contestId: work.contestId,
    externalLinks: Array.isArray(work.externalLinks) ? work.externalLinks : undefined,
  };
}

