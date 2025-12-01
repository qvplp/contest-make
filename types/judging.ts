/**
 * 審査関連の型定義
 */

import { ContestInfo } from './contests';
import { Work } from './works';

/**
 * 審査可能なコンテスト情報（審査員向け）
 */
export interface JudgableContest extends ContestInfo {
  scheduleStatus: 'upcoming' | 'submission' | 'review' | 'announcement' | 'ended';
}

/**
 * 審査用作品情報
 */
export interface JudgingWork extends Work {
  votes: number; // ユーザー投票数
  isNominated: boolean; // ノミネート済みかどうか
  nominatedCategory?: string; // ノミネートされたカテゴリ
}

/**
 * ノミネート情報
 */
export interface Nomination {
  workId: string;
  category: string;
  nominatedAt: string;
  nominatedBy: string; // 審査員ID
}

/**
 * カテゴリごとのノミネート一覧
 */
export interface CategoryNominations {
  category: string;
  works: JudgingWork[];
}

