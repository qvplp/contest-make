/**
 * コンテスト情報の型定義と定数
 */

/**
 * 応募形式の種類
 */
export type SubmissionFormat = 'video_only' | 'external_link_only' | 'video_and_external' | 'all';

/**
 * 外部リンクの種類（将来的に拡張可能）
 */
export type ExternalLinkType = 'youtube' | 'vimeo' | 'nicovideo' | 'other';

/**
 * コンテストの応募設定
 */
export interface ContestSubmissionSettings {
  // 許可される応募形式
  allowedFormats: SubmissionFormat[];
  // 動画ファイルの最大アップロード数
  maxVideoFiles: number;
  // 動画ファイルの合計サイズ制限（MB）
  maxVideoTotalSizeMB: number;
  // 許可される外部リンクの種類
  allowedExternalLinkTypes: ExternalLinkType[];
  // 外部リンクの最大数
  maxExternalLinks: number;
  // 投稿済み作品から選択できる最大数（デフォルト: 1）
  maxSelectedWorks: number;
}

export interface ContestInfo {
  id: string;
  title: string;
  slug: string;
  displayName: string; // 攻略記事のタグとして使用される表示名（例: "Halloween Creation Cup 2025"）
  description: string;
  thumbnail: string;
  prize: string;
  submissions: number;
  votes: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  isActive: boolean; // DB上のフラグ（現状はstatus === 'active'で判定）
  // 審査関連のスケジュール
  reviewStartDate?: string; // 審査開始日
  reviewEndDate?: string; // 審査終了日
  resultAnnouncementDate?: string; // 結果発表日
  // 応募設定
  submissionSettings?: ContestSubmissionSettings;
}

/**
 * コンテストの審査スケジュールステータス
 */
export type ContestScheduleStatus = 'upcoming' | 'submission' | 'review' | 'announcement' | 'ended';

/**
 * コンテストの審査スケジュールステータスを取得
 */
export function getContestScheduleStatus(contest: ContestInfo): ContestScheduleStatus {
  const now = new Date();
  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);
  const reviewStartDate = contest.reviewStartDate ? new Date(contest.reviewStartDate) : null;
  const reviewEndDate = contest.reviewEndDate ? new Date(contest.reviewEndDate) : null;
  const resultAnnouncementDate = contest.resultAnnouncementDate ? new Date(contest.resultAnnouncementDate) : null;

  if (now < startDate) {
    return 'upcoming';
  }
  if (now < endDate) {
    return 'submission';
  }
  if (reviewStartDate && reviewEndDate && now >= reviewStartDate && now < reviewEndDate) {
    return 'review';
  }
  if (resultAnnouncementDate && reviewEndDate && now >= reviewEndDate && now < resultAnnouncementDate) {
    return 'announcement';
  }
  return 'ended';
}

/**
 * 公開済みのコンテスト一覧
 * 攻略記事のタグ選択で使用される
 */
export const AVAILABLE_CONTESTS: ContestInfo[] = [
  {
    id: '1',
    title: 'ハロウィン創作カップ2025',
    slug: 'halloween2025',
    displayName: 'Halloween Creation Cup 2025',
    description: 'AIの力で最高のハロウィン作品を創造しよう！総額50万円の賞金をかけた創作コンテスト',
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

/**
 * コンテストのスラッグからコンテスト情報を取得
 */
export function getContestBySlug(slug: string): ContestInfo | undefined {
  return AVAILABLE_CONTESTS.find((contest) => contest.slug === slug);
}

/**
 * コンテストの表示名からコンテスト情報を取得
 */
export function getContestByDisplayName(displayName: string): ContestInfo | undefined {
  return AVAILABLE_CONTESTS.find((contest) => contest.displayName === displayName);
}

/**
 * 現在開催中のコンテスト一覧を取得
 */
export function getActiveContests(): ContestInfo[] {
  return AVAILABLE_CONTESTS.filter((contest) => contest.isActive && contest.status === 'active');
}









