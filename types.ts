export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  telegramPostDraft: string;
  url?: string;
  timestamp: string;
}

export type RegionKey = 'DNR' | 'LNR' | 'ZO' | 'HO';

export interface RegionConfig {
  key: RegionKey;
  name: string;
  fullName: string;
  color: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
}