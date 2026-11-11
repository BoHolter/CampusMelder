import * as FileSystem from 'expo-file-system/legacy';

/** Leest een lokale foto-URI in als base64 (voor sync naar PC). */
export async function uriToBase64(uri: string): Promise<string | null> {
  try {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch {
    return null;
  }
}
