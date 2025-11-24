
export type RegionKey = 'dnr' | 'lnr' | 'zo' | 'ho';

export interface Region {
  key: RegionKey;
  name: string;
  fullName: string;
  color: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  telegramPostDraft: string;
  url?: string;
  timestamp: string;
  source?: string;
}

export interface NewsState {
  items: NewsItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// These types are retained to prevent build errors in legacy components
export interface DemoTrack {
  title: string;
  category: string;
  duration: string;
}

export interface ScriptRequest {
  topic: string;
  tone: string;
  type: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}
