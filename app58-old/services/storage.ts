import AsyncStorage from '@react-native-async-storage/async-storage';
import { Melding } from '../types/melding';

const STORAGE_KEY = 'campus_melder_meldingen';

export async function getMeldingen(): Promise<Melding[]> {
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

export async function getMeldingById(id: string): Promise<Melding | null> {
  const list = await getMeldingen();
  return list.find((m) => m.id === id) ?? null;
}

export async function saveMelding(melding: Melding): Promise<void> {
  const list = await getMeldingen();
  const index = list.findIndex((m) => m.id === melding.id);
  if (index >= 0) {
    list[index] = melding;
  } else {
    list.unshift(melding);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function updateMeldingStatus(
  id: string,
  status: Melding['status']
): Promise<Melding | null> {
  const melding = await getMeldingById(id);
  if (!melding) return null;
  const updated = { ...melding, status };
  await saveMelding(updated);
  return updated;
}
