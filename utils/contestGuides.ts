/**
 * コンテスト関連の攻略記事を取得するユーティリティ関数
 */

import { ContestInfo } from '@/modules/contest/domain/Contest';

interface Guide {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  thumbnail: string;
  excerpt: string;
  category: string;
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  contestTag?: string;
}

/**
 * コンテストに関連する攻略記事を取得
 * 
 * @param allGuides すべての攻略記事
 * @param contestInfo コンテスト情報
 * @param limit 取得する記事数の上限（デフォルト: 10）
 * @returns コンテストに関連する攻略記事の配列
 */
export function getContestRelatedGuides(
  allGuides: Guide[],
  contestInfo: ContestInfo,
  limit: number = 10
): Guide[] {
  return allGuides
    .filter((guide) => guide.contestTag === contestInfo.displayName)
    .slice(0, limit);
}

/**
 * コンテストのスラッグから関連する攻略記事を取得
 * 
 * @param allGuides すべての攻略記事
 * @param contestSlug コンテストのスラッグ
 * @param limit 取得する記事数の上限（デフォルト: 10）
 * @returns コンテストに関連する攻略記事の配列
 */
export function getContestRelatedGuidesBySlug(
  allGuides: Guide[],
  contestSlug: string,
  limit: number = 10
): Guide[] {
  // 実際の実装では、コンテスト情報を取得してからフィルタリング
  // ここでは簡易的な実装として、allGuidesから直接フィルタリング
  // 実際のアプリケーションでは、APIから取得するか、コンテスト情報を引数として受け取る
  return allGuides.slice(0, limit);
}









