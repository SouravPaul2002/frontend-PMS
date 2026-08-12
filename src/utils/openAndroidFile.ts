import { Dirs, FileSystem } from 'react-native-file-access';
import FileViewer from 'react-native-file-viewer';

// Lazy-import to avoid circular deps — same pattern as client.ts
let getServerUrl: () => string = () => 'http://192.168.0.105:8000';

export const setFileServerUrlGetter = (fn: () => string) => {
  getServerUrl = fn;
};

const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':  return 'application/pdf';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png':  return 'image/png';
    case 'webp': return 'image/webp';
    case 'txt':  return 'text/plain';
    case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'pptx': return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    default:     return 'application/octet-stream';
  }
};

const getFileType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':              return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':             return 'image';
    case 'txt':              return 'txt';
    case 'docx':             return 'docx';
    case 'pptx':             return 'pptx';
    default:                 return 'pdf';
  }
};

export const openAndroidFile = async (
  _originalUri: string,   // kept for API compatibility, no longer used
  fileName: string
) => {
  try {
    const decodedFileName = decodeURIComponent(fileName);
    const fileType        = getFileType(decodedFileName);
    const mimeType        = getMimeType(decodedFileName);
    const cachePath       = `${Dirs.CacheDir}/${decodedFileName}`;
    const serverUrl       = getServerUrl();
    const downloadUrl     = `${serverUrl}/files/serve/${fileType}/${encodeURIComponent(decodedFileName)}`;

    console.log('DOWNLOADING FROM:', downloadUrl);

    await FileSystem.fetch(downloadUrl, {
      path: cachePath,
      method: 'GET',
    });

    console.log('SAVED TO CACHE:', cachePath);
    console.log('MIME TYPE:', mimeType);

    await FileViewer.open(cachePath, {
      showOpenWithDialog: true,
      mimeType,
    } as any);

    console.log('FILE OPENED');

  } catch (error) {
    console.log('OPEN ERROR:', error);
  }
};