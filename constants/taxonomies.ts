import type { AIModel, Classification } from '@/modules/guide/domain/GuideTaxonomy';

export const GUIDE_CATEGORIES = [
  'プロンプト技術',
  'モデル別攻略',
  'アニメーション',
  'エフェクト・演出',
  'オブジェクト制作',
  'キャラクターデザイン',
  'ポートレート',
  'ワークフロー',
] as const;

export const CLASSIFICATION_OPTIONS: Classification[] = [
  'アニメ',
  '漫画',
  '実写',
  'カメラワーク',
  'ワークフロー',
  'AIモデル',
];

export const AI_MODEL_OPTIONS: AIModel[] = [
  'GPT-5',
  'Sora2',
  'Seedream',
  'Seedance',
  'Dreamina',
  'Omnihuman',
  'Hotgen General',
  'Claude 4',
  'Midjourney v7',
  'DALL-E 4',
];


