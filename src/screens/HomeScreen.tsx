import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import { useSearchStore } from '../api/searchStore';
import { colors, spacing, typography } from '../theme';
import {
  useHistoryStore
}
  from '../store/stores';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const {
    query,
    setQuery,
    search,
    isLoading,
  } = useSearchStore();

  const {
    entries,
    addEntry,
    clearHistory,
  } = useHistoryStore();

  const handleSearch = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await search(trimmed);
    addEntry(trimmed, null);

    navigation.navigate(
      'SearchResults'
    );
  };
  useEffect(() => {
    // persist middleware auto-rehydrates; no manual loadHistory needed
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Personal Memory Search
      </Text>

      <Text style={styles.subtitle}>
        Search PDFs, Images, DOCX, PPTX and TXT files
      </Text>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
        onClear={() => setQuery('')}
      />
      <View
        style={{
          marginTop: 20,
        }}
      >

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'space-between',
            marginBottom: 10,
          }}
        >

          <Text
            style={{
              color: colors.text,
              fontSize: typography.md,
              fontWeight: typography.bold,
            }}
          >
            Recent Searches
          </Text>

          <TouchableOpacity
            onPress={clearHistory}
          >
            <Text
              style={{
                color: colors.primary,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>

        </View>

        {entries.map(
          (entry, index) => (

            <TouchableOpacity
              key={index}
              onPress={() => {

                setQuery(entry.text);

                navigation.navigate(
                  'SearchResults',
                  {
                    query: entry.text,
                  }
                );
              }}
              style={{
                backgroundColor: colors.bgCard,
                padding: spacing.md,
                borderRadius: spacing.sm,
                marginBottom: spacing.sm,
              }}
            >

              <Text
                style={{
                  color: colors.text,
                }}
              >
                🔍 {entry.text}
              </Text>

            </TouchableOpacity>
          )
        )}

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSearch(query)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Searching...' : 'Search'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.textSub,
    fontSize: typography.base,
    marginBottom: spacing.xl,
  },

  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.text,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
});