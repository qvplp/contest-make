/**
 * NOTE:
 * このファイルは modules/contest 配下へのエイリアスです。
 * 新規実装は modules/contest を直接参照してください。
 */
export type {
  SubmissionFormat,
  ExternalLinkType,
  ContestSubmissionSettings,
  ContestInfo,
  ContestScheduleStatus,
} from '@/modules/contest/domain/Contest';
export { getContestScheduleStatus } from '@/modules/contest/domain/Contest';
export type { ContestQueryService } from '@/modules/contest/application/ContestQueryService';
export {
  StaticContestQueryService,
  CONTESTS_STATIC_DATA as AVAILABLE_CONTESTS,
} from '@/modules/contest/infra/StaticContestQueryService';
export const getContestBySlug = (slug: string) =>
  new (require('@/modules/contest/infra/StaticContestQueryService').StaticContestQueryService)().getBySlug(slug);
export const getActiveContests = () =>
  new (require('@/modules/contest/infra/StaticContestQueryService').StaticContestQueryService)().getActive();
