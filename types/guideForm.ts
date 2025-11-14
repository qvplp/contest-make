/**
 * 攻略記事フォームで使用する型定義
 */

export type Classification = 'アニメ' | '漫画' | '実写' | 'カメラワーク' | 'ワークフロー' | 'AIモデル';

export type AIModel =
  | 'GPT-5'
  | 'Sora2'
  | 'Seedream'
  | 'Seedance'
  | 'Dreamina'
  | 'Omnihuman'
  | 'Hotgen General'
  | 'Claude 4'
  | 'Midjourney v7'
  | 'DALL-E 4';

/**
 * 引用した記事の情報
 */
export interface CitedGuide {
  id: string; // 入力された記事ID
  guideId?: number; // 実際の記事ID（検証後）
}

/**
 * 第1ページ（コンテンツ編集）のフォームデータ
 */
export interface ContentFormData {
  title: string;
  excerpt: string;
  sections: import('@/utils/draftManager').Section[];
  thumbnail: File | null;
  thumbnailPreview: string | null;
  citedGuides: CitedGuide[]; // 引用した記事のリスト
}

/**
 * 第2ページ（設定）のフォームデータ
 */
export interface SettingsFormData {
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  contestTag: string;
}

/**
 * 完全なフォームデータ（投稿時に使用）
 */
export interface CompleteFormData extends ContentFormData, SettingsFormData {}

