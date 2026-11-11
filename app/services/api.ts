import { Melding } from '../types/melding';
import { getApiBaseUrl } from './config';

function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 4000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  const headers = new Headers(init.headers);
  // localtunnel interstitial omzeilen
  if (url.includes('loca.lt')) {
    headers.set('Bypass-Tunnel-Reminder', 'true');
  }
  return fetch(url, { ...init, headers, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

export async function isOnline(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/health`, {
      method: 'GET',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRemotePing(): Promise<boolean> {
  return isOnline();
}

export async function fetchMeldingenRemote(): Promise<Melding[]> {
  const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/meldingen`);
  if (!res.ok) throw new Error(`Ophalen mislukt (HTTP ${res.status})`);
  return (await res.json()) as Melding[];
}

export async function fetchMeldingRemote(id: string): Promise<Melding | null> {
  const res = await fetchWithTimeout(
    `${getApiBaseUrl()}/api/meldingen/${encodeURIComponent(id)}`
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Ophalen mislukt (HTTP ${res.status})`);
  return (await res.json()) as Melding;
}

/** Slaat melding op in PC JSON-API (+ internet/hardware-eis). */
export async function syncMelding(melding: Melding): Promise<boolean> {
  const online = await isOnline();
  if (!online) {
    throw new Error(
      'Kan de PC-API niet bereiken. Zet de server aan (poort 3001) en gebruik hetzelfde wifi.'
    );
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(
      `${getApiBaseUrl()}/api/meldingen`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...melding, synced: true }),
      },
      15000
    );
  } catch {
    throw new Error(
      'Kan de PC-API niet bereiken. Zet de server aan (poort 3001) en gebruik hetzelfde wifi.'
    );
  }

  if (!response.ok) {
    throw new Error(`Sync mislukt (HTTP ${response.status})`);
  }

  await response.json();
  return true;
}

export async function patchMeldingRemote(
  id: string,
  patch: Partial<Melding>
): Promise<Melding> {
  const res = await fetchWithTimeout(
    `${getApiBaseUrl()}/api/meldingen/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    },
    10000
  );
  if (!res.ok) throw new Error(`Update mislukt (HTTP ${res.status})`);
  return (await res.json()) as Melding;
}

export type PendingNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export async function fetchPendingNotifications(): Promise<PendingNotification[]> {
  try {
    const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/notify/pending`);
    if (!res.ok) return [];
    return (await res.json()) as PendingNotification[];
  } catch {
    return [];
  }
}
