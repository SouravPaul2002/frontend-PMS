import { FileSystem, Dirs } from 'react-native-file-access';
import FileViewer from 'react-native-file-viewer';

export const openAndroidFile = async (
  originalUri: string,
  fileName: string
) => {

  try {

    const decodedFileName =
      decodeURIComponent(fileName);

    const cachePath =
      `${Dirs.CacheDir}/${decodedFileName}`;

    console.log(
      'COPYING:',
      originalUri
    );

    await FileSystem.cp(
      originalUri,
      cachePath
    );

    console.log(
      'COPIED TO:',
      cachePath
    );

    console.log(
      'DECODED FILE NAME:',
      decodedFileName
    );

    console.log(
      'OPENING FILE:',
      cachePath
    );

    const exists =
      await FileSystem.exists(
        cachePath
      );

    console.log(
      'FILE EXISTS:',
      exists
    );

    await FileViewer.open(
      cachePath,
      {
        showOpenWithDialog: true
      }
    );

    console.log(
      'FILE OPENED'
    );

  } catch (error) {

    console.log(
      'OPEN ERROR:',
      error
    );
  }
};