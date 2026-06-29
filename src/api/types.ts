// ─── Search Types ────────────────────────────────────────────────────────────

import { ReactNode } from "react";

export interface SearchRequest {
  query: string;
  file_type?: string;
  limit?: number;
  offset?: number;
}

export interface FileScores {
  text_score: number;
  image_score: number;
  fusion_score: number;
  distance?: number;
}

export interface SearchResult {
  original_uri: ReactNode;
  file_name: string;
  file_type?: string;
  path: string;

  summary?: string;
  keywords?: string[];
  topics?: string[];

  metadata?: Record<string, any>;

  scores?: {
    text_score?: number;
    image_score?: number;
    fusion_score?: number;
    distance?: number;
  };

  distance?: number;
  source?: string;

  rewritten_query?: string;
  intent?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  rewritten_query: string;
  intent: string;
  query_time_ms: number;
}

// ─── Scan Types ───────────────────────────────────────────────────────────────

export type ScanMode = 'full' | 'incremental';

export type ScanStatus = 'idle' | 'running' | 'paused' | 'complete' | 'error';

export interface ScanStatusResponse {
  status: ScanStatus;
  total_files: number;
  indexed_files: number;
  current_file: string | null;
  queue_depth: number;
  last_scan_time: string | null;
  error_count: number;
  file_type_counts: {
    pdf: number;
    image: number;
    txt: number;
    docx: number;
    pptx: number;
  };
}

export interface ScanStartResponse {
  started: boolean;
  mode: ScanMode;
  message: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
}

// ─── navigation/types.ts ──────────────────────────────────────────────────────

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  SearchResults: { query?: string };
  FileDetails: { result: SearchResult; autoOpen?: boolean };
  Scan: undefined;
  Settings: undefined;
};
