export interface CitedGuideInfo {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  publishedAt: string; // ISO 8601 形式
}

const mockCitedGuides: Record<string, CitedGuideInfo> = {
  'guide-001': {
    id: 'guide-001',
    title: 'Midjourneyで美しい風景画を生成するための完全ガイド',
    thumbnailUrl: '/mock/thumbnails/guide-001.jpg',
    author: {
      id: 'user-001',
      name: 'クリエイター太郎',
      avatarUrl: '/mock/avatars/user-001.jpg',
    },
    publishedAt: '2025-01-15T10:30:00Z',
  },
  'guide-002': {
    id: 'guide-002',
    title: 'DALL-E 3のプロンプト術',
    thumbnailUrl: '/mock/thumbnails/guide-002.jpg',
    author: {
      id: 'user-002',
      name: 'AIアートマスター',
      avatarUrl: null,
    },
    publishedAt: '2025-02-20T14:00:00Z',
  },
  'guide-003': {
    id: 'guide-003',
    title: 'アニメ調キャラクターを量産するためのプロンプト設計',
    thumbnailUrl: '/mock/thumbnails/guide-003.jpg',
    author: {
      id: 'user-003',
      name: 'アニメ工房',
      avatarUrl: '/mock/avatars/user-003.jpg',
    },
    publishedAt: '2025-03-05T09:00:00Z',
  },
  'guide-004': {
    id: 'guide-004',
    title: 'カメラワークで魅せるショートアニメ制作術',
    thumbnailUrl: '/mock/thumbnails/guide-004.jpg',
    author: {
      id: 'user-004',
      name: 'ショートアニメ職人',
      avatarUrl: null,
    },
    publishedAt: '2025-03-18T12:15:00Z',
  },
  'guide-005': {
    id: 'guide-005',
    title: '生成AIワークフローを自動化するベストプラクティス',
    thumbnailUrl: '/mock/thumbnails/guide-005.jpg',
    author: {
      id: 'user-005',
      name: 'ワークフロー設計者',
      avatarUrl: '/mock/avatars/user-005.jpg',
    },
    publishedAt: '2025-04-01T08:45:00Z',
  },
};

export async function getCitedGuideInfo(
  guideId: string
): Promise<CitedGuideInfo | null> {
  // 将来的に Supabase などの DB 取得に差し替え予定
  return mockCitedGuides[guideId] ?? null;
}

export async function getCitedGuidesInfo(
  guideIds: string[]
): Promise<CitedGuideInfo[]> {
  const uniqueIds = Array.from(new Set(guideIds));
  const results = await Promise.all(uniqueIds.map((id) => getCitedGuideInfo(id)));
  return results.filter((g): g is CitedGuideInfo => g !== null);
}


