// ─── searchStore.ts ───────────────────────────────────────────────────────────
import { create } from 'zustand';
import { SearchResult, ApiError } from '../api/types';
import { searchFiles } from '../api/search';

const PAGE_SIZE = 20;

export type FileTypeFilter = 'all' | 'pdf' | 'image' | 'docx' | 'pptx' | 'txt';

interface SearchState {
  query: string;
  results: SearchResult[];
  intent: string | null;
  rewrittenQuery: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  filter: FileTypeFilter;
  queryTimeMs: number | null;

  setQuery: (q: string) => void;
  setFilter: (f: FileTypeFilter) => void;
  search: (q: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  intent: null,
  rewrittenQuery: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  total: 0,
  page: 0,
  hasMore: false,
  filter: 'all',
  queryTimeMs: null,

  setQuery: q => set({ query: q }),

  setFilter: f => {
    set({ filter: f });
    const q = get().query;
    if (q.trim()) get().search(q);
  },

  search: async (q: string) => {
    if (!q.trim()) {
      set({ results: [], query: q, error: null, intent: null, rewrittenQuery: null });
      return;
    }
    set({ isLoading: true, error: null, query: q, page: 0, results: [] });
    try {
      const { filter } = get();
      const data = await searchFiles({
        query: q,
        file_type: filter === 'all' ? undefined : filter,
        limit: PAGE_SIZE,
        offset: 0,
      });
      set({
        results: data.results,
        total: data.total,
        intent: data.intent,
        rewrittenQuery: data.rewritten_query !== q ? data.rewritten_query : null,
        hasMore: data.results.length === PAGE_SIZE,
        page: 1,
        isLoading: false,
        queryTimeMs: data.query_time_ms,
      });
    } catch (err: any) {
      if (err?.message === 'cancelled') return;
      set({ isLoading: false, error: err?.message ?? 'Search failed.' });
    }
  },

  loadMore: async () => {
    const { query, filter, page, isLoadingMore, hasMore, results } = get();
    if (!hasMore || isLoadingMore) return;
    set({ isLoadingMore: true });
    try {
      const data = await searchFiles({
        query,
        file_type: filter === 'all' ? undefined : filter,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      set({
        results: [...results, ...data.results],
        hasMore: data.results.length === PAGE_SIZE,
        page: page + 1,
        isLoadingMore: false,
      });
    } catch {
      set({ isLoadingMore: false });
    }
  },

  clearResults: () =>
    set({
      results: [],
      query: '',
      intent: null,
      rewrittenQuery: null,
      error: null,
      total: 0,
      hasMore: false,
    }),
}));
