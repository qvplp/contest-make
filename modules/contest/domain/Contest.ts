export type SubmissionFormat =
  | 'video_only'
  | 'external_link_only'
  | 'video_and_external'
  | 'all';

export type ExternalLinkType = 'youtube' | 'vimeo' | 'nicovideo' | 'other';

export type ContestSubmissionSettings = {
  allowedFormats: SubmissionFormat[];
  maxVideoFiles: number;
  maxVideoTotalSizeMB: number;
  allowedExternalLinkTypes: ExternalLinkType[];
  maxExternalLinks: number;
  maxSelectedWorks: number;
};

export type ContestInfo = {
  id: string;
  title: string;
  slug: string;
  displayName: string;
  description: string;
  thumbnail: string;
  prize: string;
  submissions: number;
  votes: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'ended';
  isActive: boolean;
  reviewStartDate?: string;
  reviewEndDate?: string;
  resultAnnouncementDate?: string;
  submissionSettings?: ContestSubmissionSettings;
};

export type ContestScheduleStatus =
  | 'upcoming'
  | 'submission'
  | 'review'
  | 'announcement'
  | 'ended';

export function getContestScheduleStatus(contest: ContestInfo): ContestScheduleStatus {
  const now = new Date();
  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);
  const reviewStartDate = contest.reviewStartDate ? new Date(contest.reviewStartDate) : null;
  const reviewEndDate = contest.reviewEndDate ? new Date(contest.reviewEndDate) : null;
  const resultAnnouncementDate = contest.resultAnnouncementDate
    ? new Date(contest.resultAnnouncementDate)
    : null;

  if (now < startDate) return 'upcoming';
  if (now < endDate) return 'submission';
  if (reviewStartDate && reviewEndDate && now >= reviewStartDate && now < reviewEndDate) {
    return 'review';
  }
  if (
    resultAnnouncementDate &&
    reviewEndDate &&
    now >= reviewEndDate &&
    now < resultAnnouncementDate
  ) {
    return 'announcement';
  }
  return 'ended';
}

