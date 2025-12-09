import type { AIModel, Classification } from '../../domain/GuideTaxonomy';
import type { CitedGuide } from '../../domain/GuideReference';

export type ContentFormDto = {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: File | null;
  thumbnailPreview: string | null;
  citedGuides: CitedGuide[];
};

export type SettingsFormDto = {
  category: string;
  classifications: Classification[];
  aiModels: AIModel[];
  tags: string[];
  contestTag: string;
};

export type GuideDraftDto = ContentFormDto &
  SettingsFormDto & {
    authorId: string;
    createdAt: string;
    updatedAt: string;
  };

export const initialContentFormData: ContentFormDto = {
  title: '',
  excerpt: '',
  content: '',
  thumbnail: null,
  thumbnailPreview: null,
  citedGuides: [],
};

export const initialSettingsFormData: SettingsFormDto = {
  category: '',
  classifications: [],
  aiModels: [],
  tags: [],
  contestTag: '',
};

