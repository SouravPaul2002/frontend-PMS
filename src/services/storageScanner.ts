import RNFS from 'react-native-fs';

const SUPPORTED_EXTENSIONS = [
  'pdf',
  'jpg',
  'jpeg',
  'png',
  'txt',
  'docx',
  'pptx',
];

export async function scanFolder(
  folderPath: string,
  results: any[] = []
) {
  const items = await RNFS.readDir(folderPath);

  for (const item of items) {

    if (item.isDirectory()) {

      try {
        await scanFolder(
          item.path,
          results
        );
      } catch {}

    } else {

      const ext =
        item.name
          .split('.')
          .pop()
          ?.toLowerCase();

      if (
        ext &&
        SUPPORTED_EXTENSIONS.includes(ext)
      ) {
        results.push({
          name: item.name,
          path: item.path,
          size: item.size,
        });
      }
    }
  }

  return results;
}