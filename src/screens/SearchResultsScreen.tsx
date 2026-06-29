import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors, radii, spacing, typography } from '../theme';
import { useSearchStore } from '../api/searchStore';

const getFileType = (item: any): string => {
  if (item.file_type) {
    return item.file_type;
  }
  const path = item.path || '';
  const match = path.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1] : '';
};

export default function SearchResultsScreen() {
  const navigation = useNavigation<any>();
  const { results, isLoading } = useSearchStore();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>
          Searching...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resultCount}>
        {results.length} Results Found
      </Text>

<FlatList
        data={results}
        keyExtractor={(item, index) =>
          item.path || index.toString()
        }
        renderItem={({ item }) => {
          console.log(
            "SEARCH ITEM:",
            item
          );
          const fileType = getFileType(item);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate(
                  'FileDetails',
                  { result: item }
                )
              }
            >
              <Text style={styles.fileName}>
                {item.file_name}
              </Text>

              {fileType ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {fileType.toUpperCase()}
                  </Text>
                </View>
              ) : null}

              {/* <Text
                style={styles.path}
                numberOfLines={2}
              >
                {item.original_uri}
              </Text> */}

              <Text
                style={styles.path}
                numberOfLines={2}
              >
                {
                  item.original_uri && typeof item.original_uri === 'string'
                    ? decodeURIComponent(
                      item.original_uri
                    )
                      .replace(
                        'content://com.android.externalstorage.documents/tree/primary:',
                        ''
                      )
                      .replace(
                        '/document/primary:',
                        '/'
                      )
                    : 'Unknown Location'
                }
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.bg,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },

  loadingText: {
    color: colors.text,
    fontSize: typography.lg,
  },

  resultCount: {
    color: colors.text,
    fontSize: typography.lg,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.bgCard,
    borderRadius: spacing.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  fileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
  },

  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },

  path: {
    color: colors.textSub,
    fontSize: 12,
  },
});