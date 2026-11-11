import * as Network from 'expo-network';
import { Melding } from '../types/melding';

/** Publieke mock-API om internetgebruik aan te tonen (geen echte backend nodig). */
const MOCK_API = 'https://jsonplaceholder.typicode.com/posts';

export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && state.isInternetReachable !== false);
  } catch {
    return false;
  }
}

/**
 * Verstuurt de melding naar een externe mock-API via HTTP POST.
 * Lukt dit, dan is "internetverbinding" aantoonbaar gebruikt.
 */
export async function syncMelding(melding: Melding): Promise<boolean> {
  const online = await isOnline();
  if (!online) {
    throw new Error('Geen internetverbinding. Controleer je netwerk en probeer opnieuw.');
  }

  const response = await fetch(MOCK_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: melding.titel,
      body: `${melding.beschrijving}\n\nCategorie: ${melding.categorie}\nLocatie: ${melding.locatie}\nStatus: ${melding.status}`,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sync mislukt (HTTP ${response.status})`);
  }

  await response.json();
  return true;
}

/**
 * Haalt een lijst op via GET om "internet ophalen" aan te tonen.
 * Wordt gebruikt als connectivity-check / sync-ping.
 */
export async function fetchRemotePing(): Promise<boolean> {
  const online = await isOnline();
  if (!online) return false;

  const response = await fetch(`${MOCK_API}/1`);
  return response.ok;
}
