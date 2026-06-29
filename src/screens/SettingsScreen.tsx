import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useThemeStore
} from '../theme/themeStore';

import {
  themes
} from '../theme/themes';
import { colors, radii, spacing, typography } from '../theme';
import { useSettingsStore } from '../store/stores';



export default function SettingsScreen() {
  const {
    theme,
    setTheme
  } = useThemeStore();

  const { serverUrl } = useSettingsStore();

  const [backendConnected, setBackendConnected] =
    useState(false);

  const checkBackendStatus = async () => {

    try {

      const response = await fetch(
        `${serverUrl}/status`
      );

      if (response.ok) {

        setBackendConnected(true);

      } else {

        setBackendConnected(false);

      }

    } catch {

      setBackendConnected(false);

    }

  };

  const ThemePreview = ({
    name,
    themeKey,
  }: any) => {

    const previewTheme =
      themes[
      themeKey as keyof typeof themes
      ];


    return (

      <TouchableOpacity
        style={[
          styles.themeCard,
          {
            borderColor:
              theme === themeKey
                ? previewTheme.primary
                : 'transparent',
            borderWidth: 2,
          },
        ]}
        onPress={() =>
          setTheme(themeKey)
        }
      >

        <View
          style={{
            flexDirection: 'row',
            marginBottom: spacing.sm,
          }}
        >

          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: radii.sm,
              backgroundColor: previewTheme.background,
              marginRight: spacing.xs,
            }}
          />

          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              backgroundColor:
                previewTheme.card,
              marginRight: 6,
            }}
          />

          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              backgroundColor:
                previewTheme.primary,
            }}
          />

        </View>

        <Text
          style={{
            color: previewTheme.text,
            textAlign: 'center',
          }}
        >
          {name}
        </Text>

      </TouchableOpacity>
    );
  };

  const currentTheme =
    themes[theme as keyof typeof themes];

  useEffect(() => {

    const loadTheme = async () => {

      const savedTheme =
        await AsyncStorage.getItem(
          'theme'
        );

      if (savedTheme) {

        setTheme(savedTheme);

      }

    };

    loadTheme();

    checkBackendStatus();

    const interval =
      setInterval(
        checkBackendStatus,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  useEffect(() => {

    AsyncStorage.setItem(
      'theme',
      theme
    );

  }, [theme]);


  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            currentTheme.background,
        },
      ]}
    >

      <Text
        style={[
          styles.title,
          {
            color:
              currentTheme.text,
          },
        ]}
      >
        Settings
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              currentTheme.card,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color:
                currentTheme.secondaryText,
            },
          ]}
        >
          Version
        </Text>

        <Text
          style={[
            styles.value,
            {
              color:
                currentTheme.text,
            },
          ]}
        >
          1.0
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              currentTheme.card,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color:
                currentTheme.secondaryText,
            },
          ]}
        >
          Backend Status
        </Text>

        <Text
          style={{
            color: backendConnected ? colors.success : colors.error,
            fontSize: typography.base,
            fontWeight: '600',
          }}
        >
          {
            backendConnected
              ? '🟢 Connected'
              : '🔴 Disconnected'
          }
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              currentTheme.card,
          },
        ]}
      >

        <Text
          style={[
            styles.label,
            {
              color:
                currentTheme.secondaryText,
            },
          ]}
        >
          Theme
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
          }}
        >

          <ThemePreview
            name="Dark"
            themeKey="dark"
          />

          <ThemePreview
            name="Ocean"
            themeKey="ocean"
          />

          <ThemePreview
            name="Forest"
            themeKey="forest"
          />

          <ThemePreview
            name="Sunset"
            themeKey="sunset"
          />

        </ScrollView>

      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor:
              currentTheme.card,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color:
                currentTheme.secondaryText,
            },
          ]}
        >
          Personal Memory Search Engine
        </Text>

        <Text style={styles.info}>
          AI-powered semantic search engine
          for PDFs, documents, screenshots
          and images using OCR, ChromaDB,
          CLIP, FastAPI and React Native.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.dangerButton,
          {
            backgroundColor:
              currentTheme.primary,
          }
        ]}
        onPress={() => {
          Alert.alert(
            'Reset Database',
            'This will clear indexed data.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  console.log(
                    'Reset Database'
                  );
                },
              },
            ]
          );
        }}
      >
        <Text style={styles.buttonText}>
          Reset Database
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  value: {
    color: colors.text,
    fontSize: typography.base,
  },

  dangerButton: {

    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
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

  label: {
    color: colors.textSub,
    marginBottom: spacing.sm,
  },

  input: {
    backgroundColor: colors.bgCard,
    color: colors.text,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 50,
    marginBottom: spacing.md,
  },

  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginBottom: spacing.sm, 
  },

  buttonText: {
    color: colors.text,
    fontWeight: typography.bold, 
  },

  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radii.md,
  },

  themeCard: {
    width: 120,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginRight: spacing.md,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
  },

  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  info: {
    color: colors.textSub,
    marginBottom: spacing.xs, 
  },
});