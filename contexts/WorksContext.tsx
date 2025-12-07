'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateWorkInput, Work } from '@/types/works';

interface WorksContextValue {
  userWorks: Work[];
  createWork: (input: CreateWorkInput) => { success: boolean; error?: string };
  updateWork: (workId: string, input: CreateWorkInput) => { success: boolean; error?: string };
  toggleVisibility: (workId: string) => void;
  submitWorkToContest: (workId: string, contestId: string) => { success: boolean; error?: string };
}

const WorksContext = createContext<WorksContextValue | undefined>(undefined);

export function WorksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userWorks, setUserWorks] = useState<Work[]>([]);

  const storageKey = useMemo(
    () => (user ? `user_works_${user.id}` : null),
    [user],
  );

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      setUserWorks([]);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed: Work[] = JSON.parse(stored).map(normalizeWork);
        setUserWorks(parsed);
      } catch {
        setUserWorks([]);
      }
    } else {
      setUserWorks([]);
    }
  }, [storageKey]);

  const persist = (works: Work[]) => {
    if (!storageKey || typeof window === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(works));
  };

  const createWork = (input: CreateWorkInput) => {
    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    const newWork: Work = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `work_${Date.now()}`,
      title: input.title,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || '/images/avatars/user1.jpg',
      mediaType: input.mediaType,
      mediaSource: input.mediaSource,
      summary: input.summary,
      classifications: input.classifications,
      aiModels: input.classifications.includes('AIモデル')
        ? input.aiModels
        : [],
      tags: input.tags,
      referencedGuideIds: input.referencedGuideIds,
      isHot: false,
      visibility: input.visibility,
      createdAt: new Date().toISOString(),
      stats: {
        likes: 0,
        comments: 0,
        views: 0,
      },
      externalLinks: input.externalLinks,
    };

    setUserWorks((prev) => {
      const normalizedList = prev.map(normalizeWork);
      const next = [newWork, ...normalizedList];
      persist(next);
      if (newWork.visibility === 'public') {
        addWorkToGuideCitations(newWork);
      }
      return next;
    });

    return { success: true };
  };

  const toggleVisibility = (workId: string) => {
    setUserWorks((prev) => {
      const normalizedList = prev.map(normalizeWork);
      let updatedWork: Work | null = null;
      const next = normalizedList.map((work) => {
        if (work.id !== workId) return work;
        const toggled = {
          ...work,
          visibility: work.visibility === 'public' ? 'private' : 'public',
        };
        updatedWork = toggled;
        return toggled;
      });

      persist(next);

      if (updatedWork) {
        if (updatedWork.visibility === 'public') {
          addWorkToGuideCitations(updatedWork);
        } else {
          removeWorkFromGuideCitations(updatedWork);
        }
      }

      return next;
    });
  };

  const updateWork = (workId: string, input: CreateWorkInput) => {
    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    setUserWorks((prev) => {
      const normalizedList = prev.map(normalizeWork);
      const existingWork = normalizedList.find((w) => w.id === workId);
      if (!existingWork) {
        return prev;
      }

      if (existingWork.authorId !== user.id) {
        return { success: false, error: 'この作品を編集する権限がありません' };
      }

      const wasPublic = existingWork.visibility === 'public';
      const willBePublic = input.visibility === 'public';

      const updatedWork: Work = {
        ...existingWork,
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

      const next = normalizedList.map((w) => (w.id === workId ? updatedWork : w));
      persist(next);

      // 公開状態の変更に応じて引用を更新
      if (wasPublic && !willBePublic) {
        removeWorkFromGuideCitations(existingWork);
      } else if (!wasPublic && willBePublic) {
        addWorkToGuideCitations(updatedWork);
      } else if (willBePublic) {
        // 公開中の場合、引用を更新
        removeWorkFromGuideCitations(existingWork);
        addWorkToGuideCitations(updatedWork);
      }

      return next;
    });

    return { success: true };
  };

  const submitWorkToContest = (workId: string, contestId: string) => {
    if (!user) {
      return { success: false, error: 'ログインが必要です' };
    }

    setUserWorks((prev) => {
      const normalizedList = prev.map(normalizeWork);
      const work = normalizedList.find((w) => w.id === workId);
      if (!work) {
        return prev;
      }

      if (work.authorId !== user.id) {
        return prev;
      }

      const next = normalizedList.map((w) => {
        if (w.id !== workId) return w;
        return {
          ...w,
          contestId,
        };
      });

      persist(next);
      return next;
    });

    return { success: true };
  };

  return (
    <WorksContext.Provider value={{ userWorks, createWork, updateWork, toggleVisibility, submitWorkToContest }}>
      {children}
    </WorksContext.Provider>
  );
}

export function useWorks() {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error('useWorks must be used within a WorksProvider');
  }
  return context;
}

function normalizeWork(work: any): Work {
  const mediaSource =
    work.mediaSource || work.thumbnailUrl || work.mediaUrl || '/images/samples/sample1.jpg';

  return {
    id: work.id,
    title: work.title || '無題の作品',
    authorId: work.authorId || '',
    authorName: work.authorName || 'ユーザー',
    authorAvatar: work.authorAvatar || '/images/avatars/user1.jpg',
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

function addWorkToGuideCitations(work: Work) {
  if (typeof window === 'undefined') return;
  if (!work.referencedGuideIds || work.referencedGuideIds.length === 0) return;

  work.referencedGuideIds.forEach((guideId) => {
    if (!guideId) return;
    const key = `guide_citations_${guideId}`;
    let citations: any[] = [];
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        citations = JSON.parse(stored);
      } catch {
        citations = [];
      }
    }

    const exists = citations.some((citation) => citation.id === work.id);
    if (exists) return;

    citations.push({
      id: work.id,
      title: work.title,
      author: work.authorName,
      mediaType: work.mediaType,
      mediaSource: work.mediaSource,
      createdAt: work.createdAt,
    });

    localStorage.setItem(key, JSON.stringify(citations));
  });
}

function removeWorkFromGuideCitations(work: Work) {
  if (typeof window === 'undefined') return;
  if (!work.referencedGuideIds || work.referencedGuideIds.length === 0) return;

  work.referencedGuideIds.forEach((guideId) => {
    if (!guideId) return;
    const key = `guide_citations_${guideId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    let citations: any[] = [];
    try {
      citations = JSON.parse(stored);
    } catch {
      citations = [];
    }

    const next = citations.filter((citation) => citation.id !== work.id);
    localStorage.setItem(key, JSON.stringify(next));
  });
}


