/**
 * NOTE:
 * このファイルは modules/works 配下の型へのエイリアスです。
 * 新規実装は modules/works を直接参照してください。
 */
export type {
  WorkMediaType,
  WorkVisibility,
  WorkStats,
  ExternalLink,
  Work,
  CreateWorkInput,
} from '@/modules/works/domain/Work';
export type { AIModel, Classification } from '@/modules/guide/domain/GuideTaxonomy';
