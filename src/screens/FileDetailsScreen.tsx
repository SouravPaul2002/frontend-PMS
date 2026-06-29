import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { colors, spacing, typography, radii } from '../theme';
import { TouchableOpacity } from 'react-native';
import { openAndroidFile } from '../utils/openAndroidFile';
import { useRoute } from '@react-navigation/native';



const getFileType = (result: any): string => {
  if (result.file_type) {
    return result.file_type;
  }
  const path = result.path || '';
  const match = path.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1] : '';
};

export default function FileDetailsScreen() {
  const route = useRoute<any>();

  const { result } = route.params;
  console.log("original uri: ", result);
  const fileType = getFileType(result);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        {decodeURIComponent(result.file_name)}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          File Type
        </Text>

        <Text style={styles.value}>
          {fileType
            ? fileType.toUpperCase()
            : 'UNKNOWN'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          File Size
        </Text>

        <Text style={styles.value}>
          {result.file_size
            ? `${result.file_size} MB`
            : 'Unknown'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Last Modified
        </Text>

        <Text style={styles.value}>
          {result.modified_time ?? 'Unknown'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.openButton}
        onPress={() =>
          openAndroidFile(
            result.original_uri,
            result.file_name
          )
        }
      >
        <Text style={styles.openButtonText}>
          Open File
        </Text>
      </TouchableOpacity>

    </ScrollView>
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
    marginBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
  },

  label: {
    color: colors.textSub,
    marginBottom: spacing.xs,
  },

  value: {
    color: colors.text,
  },

  openButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  openButtonText: {
    color: colors.text,
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
});