import type { ContestInfo } from '../domain/Contest';
import { getContestScheduleStatus } from '../domain/Contest';
import type { ContestQueryService } from '../application/ContestQueryService';

const CONTESTS: ContestInfo[] = [
  {
    id: '1',
    title: 'ハロウィン創作カップ2025',
    slug: 'halloween2025',
    displayName: 'Halloween Creation Cup 2025',
    description:
      'AIの力で最高のハロウィン作品を創造しよう！総額50万円の賞金をかけた創作コンテスト',
    thumbnail: '/images/contests/halloween2025.jpg',
    prize: '¥500,000',
    submissions: 1234,
    votes: 12345,
    startDate: '2025-10-01',
    endDate: '2025-10-25',
    reviewStartDate: '2025-10-26',
    reviewEndDate: '2025-10-31',
    resultAnnouncementDate: '2025-11-01',
    status: 'active',
    isActive: true,
    submissionSettings: {
      allowedFormats: ['all'],
      maxVideoFiles: 3,
      maxVideoTotalSizeMB: 10,
      allowedExternalLinkTypes: ['youtube'],
      maxExternalLinks: 10,
      maxSelectedWorks: 1,
    },
  },
  {
    id: '2',
    title: 'ウィンターファンタジーコンテスト',
    slug: 'winter2025',
    displayName: 'Winter Fantasy Contest 2025',
    description: '冬をテーマにした幻想的な作品を募集します',
    thumbnail: '/images/contests/winter2025.jpg',
    prize: '¥300,000',
    submissions: 0,
    votes: 0,
    startDate: '2025-12-01',
    endDate: '2026-01-10',
    reviewStartDate: '2026-01-11',
    reviewEndDate: '2026-01-13',
    resultAnnouncementDate: '2026-01-15',
    status: 'upcoming',
    isActive: false,
  },
  {
    id: '3',
    title: 'サマーポートレートコンテスト',
    slug: 'summer2024',
    displayName: 'Summer Portrait Contest 2024',
    description: '夏の思い出を彩るポートレート作品コンテスト',
    thumbnail: '/images/contests/summer2024.jpg',
    prize: '¥400,000',
    submissions: 2345,
    votes: 23456,
    startDate: '2024-07-01',
    endDate: '2024-08-25',
    reviewStartDate: '2024-08-26',
    reviewEndDate: '2024-08-29',
    resultAnnouncementDate: '2024-08-31',
    status: 'ended',
    isActive: false,
  },
];

export class StaticContestQueryService implements ContestQueryService {
  getBySlug(slug: string): ContestInfo | undefined {
    return CONTESTS.find((contest) => contest.slug === slug);
  }

  getActive(): ContestInfo[] {
    return CONTESTS.filter((contest) => contest.isActive && contest.status === 'active');
  }

  getAll(): ContestInfo[] {
    return [...CONTESTS];
  }

  getScheduleStatus(contest: ContestInfo) {
    return getContestScheduleStatus(contest);
  }
}

export const CONTESTS_STATIC_DATA = CONTESTS;

