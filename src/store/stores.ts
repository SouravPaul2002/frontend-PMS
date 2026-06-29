// ─── scanStore.ts ─────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { ScanStatus, ScanStatusResponse } from '../api/types';
import { startScan, fetchScanStatus } from '../api/scan';

interface ScanState {
  status: ScanStatus;
  totalFiles: number;
  indexedFiles: number;
  currentFile: string | null;
  queueDepth: number;
  lastScanTime: string | null;
  errorCount: number;
  fileTypeCounts: ScanStatusResponse['file_type_counts'];
  isStarting: boolean;
  startError: string | null;
  _pollInterval: ReturnType<typeof setInterval> | null;

  triggerScan: (mode: 'full' | 'incremental') => Promise<void>;
  pollStatus: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

const defaultCounts = { pdf: 0, image: 0, txt: 0, docx: 0, pptx: 0 };

export const useScanStore = create<ScanState>((set, get) => ({
  status: 'idle',
  totalFiles: 0,
  indexedFiles: 0,
  currentFile: null,
  queueDepth: 0,
  lastScanTime: null,
  errorCount: 0,
  fileTypeCounts: defaultCounts,
  isStarting: false,
  startError: null,
  _pollInterval: null,

  triggerScan: async mode => {
    set({ isStarting: true, startError: null });
    try {
      await startScan(mode);
      set({ isStarting: false, status: 'running' });
      get().startPolling();
    } catch (err: any) {
      set({ isStarting: false, startError: err?.message ?? 'Failed to start scan.' });
    }
  },

  pollStatus: async () => {
    try {
      const data = await fetchScanStatus();
      set({
        status: data.status,
        totalFiles: data.total_files,
        indexedFiles: data.indexed_files,
        currentFile: data.current_file,
        queueDepth: data.queue_depth,
        lastScanTime: data.last_scan_time,
        errorCount: data.error_count,
        fileTypeCounts: data.file_type_counts ?? defaultCounts,
      });
      if (data.status !== 'running') get().stopPolling();
    } catch {
      // silent fail — UI shows last known state
    }
  },

  startPolling: () => {
    const existing = get()._pollInterval;
    if (existing) clearInterval(existing);
    get().pollStatus(); // immediate first hit
    const id = setInterval(() => get().pollStatus(), 2500);
    set({ _pollInterval: id });
  },

  stopPolling: () => {
    const id = get()._pollInterval;
    if (id) clearInterval(id);
    set({ _pollInterval: null });
  },
}));


// ─── settingsStore.ts ─────────────────────────────────────────────────────────
import { create as createSettings } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setServerUrlGetter } from '../api/client';

interface SettingsState {
  serverUrl: string;
  theme: 'dark' | 'light';
  onboardingDone: boolean;
  setServerUrl: (url: string) => void;
  setTheme: (t: 'dark' | 'light') => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = createSettings<SettingsState>()(
  persist(
    (set, get) => ({
      serverUrl: 'http://192.168.1.101:8000',
      theme: 'dark',
      onboardingDone: false,

      setServerUrl: url => {
        set({ serverUrl: url });
        // Keep the client getter in sync
        setServerUrlGetter(() => get().serverUrl);
      },
      setTheme: t => set({ theme: t }),
      completeOnboarding: () => set({ onboardingDone: true }),
    }),
    {
      name: 'memory-search-settings',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        // After rehydration, sync client URL getter
        if (state) setServerUrlGetter(() => state.serverUrl);
      },
    }
  )
);


// ─── historyStore.ts ──────────────────────────────────────────────────────────
import { create as createHistory } from 'zustand';
import { persist as persistHistory, createJSONStorage as createJSONStorageH } from 'zustand/middleware';
import AsyncStorage2 from '@react-native-async-storage/async-storage';

const MAX_HISTORY = 50;

export interface HistoryEntry {
  text: string;
  intent: string | null;
  timestamp: number;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (text: string, intent: string | null) => void;
  removeEntry: (text: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = createHistory<HistoryState>()(
  persistHistory(
    set => ({
      entries: [],

      addEntry: (text, intent) =>
        set(state => {
          // Deduplicate by text (case-insensitive), move to top
          const filtered = state.entries.filter(
            e => e.text.toLowerCase() !== text.toLowerCase()
          );
          const next = [
            { text, intent, timestamp: Date.now() },
            ...filtered,
          ].slice(0, MAX_HISTORY);
          return { entries: next };
        }),

      removeEntry: text =>
        set(state => ({
          entries: state.entries.filter(e => e.text !== text),
        })),

      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'memory-search-history',
      storage: createJSONStorageH(() => AsyncStorage2),
    }
  )
);
