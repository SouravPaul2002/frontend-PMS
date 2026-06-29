import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HistoryState {
  history: string[];

  loadHistory: () => Promise<void>;

  addHistory: (
    query: string
  ) => Promise<void>;

  clearHistory: () => Promise<void>;
}

export const useHistoryStore =
create<HistoryState>((set, get) => ({

  history: [],

  loadHistory: async () => {

    const data =
      await AsyncStorage.getItem(
        'search_history'
      );

    if (data) {
      set({
        history:
          JSON.parse(data),
      });
    }
  },

  addHistory: async (
    query
  ) => {

    const trimmed =
      query.trim();

    if (!trimmed) {
      return;
    }

    const current =
      get().history;

    const updated = [
      trimmed,
      ...current.filter(
        item =>
          item.toLowerCase() !==
          trimmed.toLowerCase()
      ),
    ].slice(0, 10);

    set({
      history: updated,
    });

    await AsyncStorage.setItem(
      'search_history',
      JSON.stringify(updated)
    );
  },

  clearHistory: async () => {

    set({
      history: [],
    });

    await AsyncStorage.removeItem(
      'search_history'
    );
  },
}));