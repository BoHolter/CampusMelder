import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Lokale Campus Melder API op de PC (JSON-bestand).
 * Telefoon bereikt PC via LAN-IP; web via localhost.
 * Bij Expo-tunnel: /api wordt via Metro geproxied (metro.config.js) op dezelfde host.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) {
    return fromEnv;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3001';
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    // Expo Go / classic
    (Constants as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } }).manifest2
      ?.extra?.expoGo?.debuggerHost ||
    (Constants.manifest as { debuggerHost?: string } | null)?.debuggerHost;

  const host = hostUri?.split(':')[0];
  if (host) {
    // Zelfde host als Metro-tunnel → /api proxy (geen aparte :3001)
    if (host.includes('.exp.direct') || host.includes('ngrok')) {
      return `https://${host}`;
    }
    return `http://${host}:3001`;
  }

  // Fallback: huidige wifi van de PC (pas aan als je IP verandert)
  return 'http://10.74.207.118:3001';
}
