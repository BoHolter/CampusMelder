import AsyncStorage from '@react-native-async-storage/async-storage';
import { Melding } from '../types/melding';
import {
  fetchMeldingRemote,
  fetchMeldingenRemote,
  patchMeldingRemote,
  syncMelding,
} from './api';

const STORAGE_KEY = 'campus_melder_meldingen';

async function cacheAll(list: Melding[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

async function readCache(): Promise<Melding[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Melding[];
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

/** Haalt eerst van PC-API; valt terug op lokale cache. */
export async function getMeldingen(): Promise<Melding[]> {
  try {
    const remote = await fetchMeldingenRemote();
    await cacheAll(remote);
    return remote;
  } catch {
    return readCache();
  }
}

export async function getMeldingById(id: string): Promise<Melding | null> {
  try {
    const remote = await fetchMeldingRemote(id);
    if (remote) return remote;
  } catch {
    // fallback cache
  }
  const list = await readCache();
  return list.find((m) => m.id === id) ?? null;
}

export async function saveMelding(melding: Melding): Promise<void> {
  // Lokaal altijd bijwerken
  const list = await readCache();
  const index = list.findIndex((m) => m.id === melding.id);
  if (index >= 0) list[index] = melding;
  else list.unshift(melding);
  await cacheAll(list);

  // Probeer naar PC te syncen (dashboard)
  try {
    await syncMelding(melding);
  } catch {
    // Offline: blijft in cache tot er wél sync is
  }
}

export async function updateMeldingStatus(
  id: string,
  status: Melding['status']
): Promise<Melding | null> {
  const melding = await getMeldingById(id);
  if (!melding) return null;
  const updated = { ...melding, status };

  try {
    const remote = await patchMeldingRemote(id, { status });
    await saveMelding({ ...remote, synced: true });
    return remote;
  } catch {
    await saveMelding({ ...updated, synced: false });
    return updated;
  }
}
