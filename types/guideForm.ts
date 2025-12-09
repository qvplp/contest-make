/**
 * NOTE:
 * このファイルは modules/guide 配下の定義へのエイリアスとして残しています。
 * 新規実装は modules/guide/ 下を直接 import してください。
 */
export type {
  Classification,
  AIModel,
} from '@/modules/guide/domain/GuideTaxonomy';
export type { CitedGuide } from '@/modules/guide/domain/GuideReference';
export type {
  ContentFormDto as ContentFormData,
  SettingsFormDto as SettingsFormData,
  GuideDraftDto as CompleteFormData,
} from '@/modules/guide/application/dto/GuideFormDto';
export {
  initialContentFormData,
  initialSettingsFormData,
} from '@/modules/guide/application/dto/GuideFormDto';

