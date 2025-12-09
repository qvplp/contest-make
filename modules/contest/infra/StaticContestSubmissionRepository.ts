import type {
  ContestSubmission,
  ContestSubmissionRepository,
} from '../domain/ContestSubmission';

const submissionsBySlug: Record<string, ContestSubmission[]> = {
  halloween2025: [
    {
      id: 1,
      title: 'おばけハロウィン',
      author: 'user_123',
      imageUrl: '/images/samples/sample1.jpg',
      votes: 245,
      views: 1234,
      categories: ['最優秀ハロウィン雰囲気賞'],
      division: 'アニメ短編',
      createdAt: '2025-10-15T10:00:00Z',
      description: 'トリックオアトリート！をテーマにしたハロウィンの夜の物語',
      isVideo: false,
    },
    {
      id: 2,
      title: '魔女の宅配便',
      author: 'artist_456',
      imageUrl: '/images/samples/sample2.jpg',
      videoUrl: '/videos/sample2.mp4',
      votes: 189,
      views: 987,
      categories: ['最優秀キャラクター賞', '最優秀アニメーション賞'],
      division: 'アニメ短編',
      createdAt: '2025-10-14T15:30:00Z',
      description: '魔女が夜空を飛ぶ幻想的なアニメーション',
      isVideo: true,
    },
    {
      id: 3,
      title: 'パンプキンナイト',
      author: 'creator_789',
      imageUrl: '/images/samples/sample3.jpg',
      votes: 156,
      views: 765,
      categories: ['最優秀ホラー演出賞'],
      division: 'イラスト',
      createdAt: '2025-10-13T09:15:00Z',
      description: 'かぼちゃのランタンが並ぶ不気味な夜',
      isVideo: false,
    },
    {
      id: 4,
      title: '満月の海賊船',
      author: 'pirate_012',
      imageUrl: '/images/samples/sample5.jpg',
      videoUrl: '/videos/sample5.mp4',
      votes: 134,
      views: 654,
      categories: ['最優秀ハロウィン雰囲気賞'],
      division: 'アニメ短編',
      createdAt: '2025-10-12T14:20:00Z',
      description: '満月の夜、幽霊船が海を渡る',
      isVideo: true,
    },
    {
      id: 5,
      title: 'スチームパンクハロウィン',
      author: 'steampunk_345',
      imageUrl: '/images/samples/sample7.jpg',
      votes: 112,
      views: 543,
      categories: ['最優秀キャラクター賞'],
      division: 'イラスト',
      createdAt: '2025-10-11T11:45:00Z',
      description: 'スチームパンクな世界観のハロウィン',
      isVideo: false,
    },
    {
      id: 6,
      title: 'ダンスパーティー',
      author: 'dancer_678',
      imageUrl: '/images/samples/sample8.jpg',
      videoUrl: '/videos/sample8.mp4',
      votes: 98,
      views: 432,
      categories: ['最優秀アニメーション賞'],
      division: 'アニメ短編',
      createdAt: '2025-10-10T16:00:00Z',
      description: 'ハロウィンパーティーで踊るキャラクターたち',
      isVideo: true,
    },
  ],
};

export class StaticContestSubmissionRepository
  implements ContestSubmissionRepository
{
  listByContest(slug: string): ContestSubmission[] {
    return submissionsBySlug[slug]?.map((s) => ({ ...s })) ?? [];
  }

  toggleVote(slug: string, submissionId: number): ContestSubmission[] {
    const list = submissionsBySlug[slug];
    if (!list) return [];
    const idx = list.findIndex((s) => s.id === submissionId);
    if (idx === -1) return list;
    const target = list[idx];
    const hasVoted = !!target.hasVoted;
    const updated = {
      ...target,
      hasVoted: !hasVoted,
      votes: hasVoted ? target.votes - 1 : target.votes + 1,
    };
    submissionsBySlug[slug] = [
      ...list.slice(0, idx),
      updated,
      ...list.slice(idx + 1),
    ];
    return submissionsBySlug[slug].map((s) => ({ ...s }));
  }
}

