'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CreateWorkInput, Work } from '@/modules/works/domain/Work';
import { CreateWork } from '@/modules/works/application/CreateWork';
import { UpdateWork } from '@/modules/works/application/UpdateWork';
import { ToggleWorkVisibility } from '@/modules/works/application/ToggleWorkVisibility';
import { SubmitWorkToContest } from '@/modules/works/application/SubmitWorkToContest';
import {
  CryptoWorkIdGenerator,
  LocalStorageWorkRepository,
  SystemWorkClock,
} from '@/modules/works/infra/LocalStorageWorkRepository';

interface WorksContextValue {
  userWorks: Work[];
  createWork: (input: CreateWorkInput) => { success: boolean; error?: string; work?: Work };
  updateWork: (workId: string, input: CreateWorkInput) => { success: boolean; error?: string };
  toggleVisibility: (workId: string) => void;
  submitWorkToContest: (workId: string, contestId: string) => { success: boolean; error?: string };
}

const WorksContext = createContext<WorksContextValue | undefined>(undefined);

export function WorksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userWorks, setUserWorks] = useState<Work[]>([]);

  const storageKey = useMemo(() => (user ? `user_works_${user.id}` : null), [user]);
  const workRepo = useMemo(() => {
    if (!storageKey) return null;
    return new LocalStorageWorkRepository(
      storageKey,
      new CryptoWorkIdGenerator(),
      new SystemWorkClock()
    );
  }, [storageKey]);

  const createWorkUC = useMemo(
    () => (workRepo ? new CreateWork({ works: workRepo, idGenerator: new CryptoWorkIdGenerator(), clock: new SystemWorkClock() }) : null),
    [workRepo]
  );
  const updateWorkUC = useMemo(
    () => (workRepo ? new UpdateWork({ works: workRepo }) : null),
    [workRepo]
  );
  const toggleVisibilityUC = useMemo(
    () => (workRepo ? new ToggleWorkVisibility({ works: workRepo }) : null),
    [workRepo]
  );
  const submitWorkToContestUC = useMemo(
    () => (workRepo ? new SubmitWorkToContest({ works: workRepo }) : null),
    [workRepo]
  );

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined' || !workRepo) {
      setUserWorks([]);
      return;
    }

    setUserWorks(workRepo.listByUser(user.id));
  }, [storageKey, user?.id, workRepo]);

  const createWork = (input: CreateWorkInput) => {
    if (!user || !createWorkUC) return { success: false, error: 'ログインが必要です' };
    const result = createWorkUC.execute(input, { id: user.id, name: user.name, avatar: user.avatar });
    if (result.success && result.work) {
      setUserWorks((prev) => [result.work!, ...prev]);
      if (result.work.visibility === 'public') addWorkToGuideCitations(result.work);
    }
    return result;
  };

  const toggleVisibility = (workId: string) => {
    if (!toggleVisibilityUC) return;
    const res = toggleVisibilityUC.execute(workId);
    if (!res.success || !res.work) return;
    setUserWorks((prev) => prev.map((w) => (w.id === workId ? res.work! : w)));
    if (res.work.visibility === 'public') addWorkToGuideCitations(res.work);
    else removeWorkFromGuideCitations(res.work);
  };

  const updateWork = (workId: string, input: CreateWorkInput) => {
    if (!user || !updateWorkUC) return { success: false, error: 'ログインが必要です' };
    const result = updateWorkUC.execute(workId, user.id, input);
    if (result.success) {
      setUserWorks((prev) =>
        prev.map((w) =>
          w.id === workId
            ? {
                ...w,
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
              }
            : w
        )
      );
    }
    return result;
  };

  const submitWorkToContest = (workId: string, contestId: string) => {
    if (!user || !submitWorkToContestUC)
      return { success: false, error: 'ログインが必要です' };
    const result = submitWorkToContestUC.execute(workId, user.id, contestId);
    if (result.success) {
      setUserWorks((prev) =>
        prev.map((w) => (w.id === workId ? { ...w, contestId } : w))
      );
    }
    return result;
  };

  return (
    <WorksContext.Provider
      value={{ userWorks, createWork, updateWork, toggleVisibility, submitWorkToContest }}
    >
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


