import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

import {
  getStatus,
  startFullScan,
  startIncrementalScan,
} from '../api/scan';
import { pickDirectory } from '@react-native-documents/picker';
import { FileSystem } from 'react-native-file-access';
import { colors, radii, spacing, typography } from '../theme';
import client from '../api/client';
import { useSettingsStore } from '../store/stores';



export default function ScanScreen() {

  const [status, setStatus] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFolder = async () => {
    try {

      let folder = selectedFolder;

      if (!folder) {

        folder = await pickDirectory({ requestLongTermAccess: true });

        if (!folder) {
          return;
        }

        await AsyncStorage.setItem(
          'selected_folder',
          JSON.stringify(folder)
        );

        setSelectedFolder(folder);

      }

      if (!folder) {
        return;
      }

      const files = await FileSystem.statDir(
        folder.uri
      );

      const supportedFiles = files.filter(file => {

        const name = file.filename.toLowerCase();

        return (
          name.endsWith('.pdf') ||
          name.endsWith('.jpg') ||
          name.endsWith('.jpeg') ||
          name.endsWith('.png') ||
          name.endsWith('.webp') ||
          name.endsWith('.txt') ||
          name.endsWith('.docx') ||
          name.endsWith('.pptx')
        );
      });

      console.log(
        `Found ${supportedFiles.length} supported files`
      );

      for (const file of supportedFiles) {

        const extension =
          file.filename
            .split('.')
            .pop()
            ?.toLowerCase();

        let mimeType =
          'application/octet-stream';

        if (extension === 'pdf') {
          mimeType = 'application/pdf';
        } else if (
          extension === 'jpg' ||
          extension === 'jpeg'
        ) {
          mimeType = 'image/jpeg';
        } else if (
          extension === 'png'
        ) {
          mimeType = 'image/png';
        } else if (
          extension === 'webp'
        ) {
          mimeType = 'image/webp';
        }

        const formData = new FormData();

        formData.append(
          'file',
          {
            uri: file.path,
            name: file.filename,
            type: mimeType,
          } as any
        );
        formData.append(
          'original_uri',
          file.path
        );

        const response = await client.post(
          '/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        console.log(
          'Uploaded:',
          response.data
        );
      }
      console.log('All uploads finished');

      const scanResult = await client.post('/scan/incremental');

      console.log(
        'Scan Result:',
        scanResult.data
      );

    } catch (e) {
      console.log(e);
      Alert.alert(
        'Upload Failed',
        'Some files could not be uploaded. Please check your connection and try again.'
      );
    }
  };

  const loadSavedFolder = async () => {

    try {

      const savedFolder =
        await AsyncStorage.getItem(
          'selected_folder'
        );

      if (savedFolder) {

        setSelectedFolder(
          JSON.parse(savedFolder)
        );

      }

    } catch (error) {

      console.log(
        'LOAD FOLDER ERROR',
        error
      );

    }

  };

  const loadStatus = async () => {
    try {
      const data = await getStatus();

      console.log('STATUS DATA:', data);

      setStatus(data);
      setError(null);
    } catch (err: any) {
      console.log('STATUS ERROR:', err);
      setError(err?.message ?? 'Cannot reach server.');
    }
  };

  useEffect(() => {

    loadStatus();

    loadSavedFolder();

    const interval = setInterval(() => {
      loadStatus();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const runFullScan = async () => {
    try {
      setRunning(true);

      await startFullScan();

      await loadStatus();
    } finally {
      setRunning(false);
    }
  };

  const runIncrementalScan = async () => {
    try {
      setRunning(true);

      await startIncrementalScan();

      await loadStatus();
    } finally {
      setRunning(false);
    }
  };

  if (error && !status) {
    const currentUrl = useSettingsStore.getState().serverUrl;
    return (
      <View style={styles.center}>
        <Text style={[styles.text, { color: '#FF4A4A', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }]}>
          ⚠️ Connection Error
        </Text>
        <Text style={[styles.text, { color: '#A0A0B0', marginBottom: 20, textAlign: 'center', paddingHorizontal: 30 }]}>
          {error}
        </Text>
        <Text style={[styles.text, { color: '#808090', fontSize: 13, marginBottom: 30 }]}>
          URL: {currentUrl}
        </Text>
        <TouchableOpacity
          style={[styles.button, { width: 200, marginTop: 0 }]}
          onPress={loadStatus}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!status) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.lg, flexGrow: 1 }}>
      <Text style={styles.title}>
        Scan Dashboard
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Selected Folder
        </Text>

        <Text style={styles.value}>
          {
            selectedFolder
              ? decodeURIComponent(
                selectedFolder.uri
              ).split('/')
                .pop()
              : 'No Folder Selected'
          }
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {

          const folder = await pickDirectory({ requestLongTermAccess: true });

          if (!folder) {
            return;
          }

          await AsyncStorage.setItem(
            'selected_folder',
            JSON.stringify(folder)
          );

          setSelectedFolder(folder);

        }}
      >
        <Text style={styles.buttonText}>
          Change Folder
        </Text>
      </TouchableOpacity>



      <View style={styles.card}>

        <Text
          style={{
            color: 'white',
            fontSize: typography.lg,
            fontWeight: 'bold',
            marginBottom: spacing.md,
          }}
        >
          📊 Statistics
        </Text>

        <Text style={styles.value}>
          Total Files: {status.total_files ?? 0}
        </Text>

        <Text style={styles.value}>
          PDFs: {status.pdfs ?? 0}
        </Text>

        <Text style={styles.value}>
          Images: {status.images ?? 0}
        </Text>

        <Text style={styles.value}>
          TXT: {status.txt ?? 0}
        </Text>

        <Text style={styles.value}>
          DOCX: {status.docx ?? 0}
        </Text>

        <Text style={styles.value}>
          PPTX: {status.pptx ?? 0}
        </Text>

        <Text
          style={{
            color: 'white',
            marginTop: 15,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          🗂️ Indexed Chunks
        </Text>

        <Text style={styles.value}>
          {status.indexed_chunks ?? 0}
        </Text>

        <Text
          style={{
            color: 'white',
            marginTop: 15,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          🕒 Last Scan
        </Text>

        <Text style={styles.value}>
          {
            (() => {
              const timeStr = status.last_scan_time;
              if (!timeStr) return 'Never';
              try {
                const parsedDate = new Date(timeStr);
                if (!isNaN(parsedDate.getTime())) {
                  return parsedDate.toLocaleString();
                }
              } catch (e) {}
              
              if (typeof timeStr === 'string' && timeStr.includes('T')) {
                const parts = timeStr.split('T');
                const datePart = parts[0];
                const timePart = parts[1].split('.')[0];
                return `${datePart} ${timePart}`;
              }
              return String(timeStr);
            })()
          }
        </Text>

      </View>

      <TouchableOpacity
        disabled={running}
        style={[
          styles.button,
          running && { opacity: 0.5 }
        ]}
        onPress={runFullScan}
      >
        <Text style={styles.buttonText}>
          {running ? 'Scanning...' : 'Full Rebuild'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={uploadFolder}
      >
        <Text style={styles.buttonText}>
          Scan Folder
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D14',
    padding: spacing.lg,
    paddingBottom: spacing.lg,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },

  title: {
    color: 'white',
    fontSize: typography.xl,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.bgCard,
    padding: 15,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },

  label: {
    color: colors.textSub,
    marginBottom: spacing.xs,
  },

  value: {
    color: 'white',
    fontSize: 16,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.text,
    fontWeight: 'bold',
  },

  text: {
    color: 'white',
  },
});