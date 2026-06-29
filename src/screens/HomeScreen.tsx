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
  from '../store/historyStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const {
    query,
    setQuery,
    search,
    isLoading,
  } = useSearchStore();

  const {
    history,
    loadHistory,
    addHistory,
    clearHistory,
  } = useHistoryStore();

  const handleSearch = async (text: string) => {
    await search(text);

    if (!query.trim()) {
      return;
    }

    addHistory(query);

    navigation.navigate(
      'SearchResults'
    );
  };
  useEffect(() => {
    loadHistory();
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

        {history.map(
          (item, index) => (

            <TouchableOpacity
              key={index}
              onPress={() => {

                setQuery(item);

                navigation.navigate(
                  'SearchResults',
                  {
                    query: item,
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
                🔍 {item}
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