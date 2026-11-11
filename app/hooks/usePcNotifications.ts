import { useEffect } from 'react';
import { AppState } from 'react-native';
import { fetchPendingNotifications } from '../services/api';
import { successFeedback } from '../services/feedback';

/** Pollt de PC-API op berichten die vanaf localhost zijn verstuurd. */
export function usePcNotifications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      if (AppState.currentState !== 'active') return;
      const pending = await fetchPendingNotifications();
      for (const n of pending) {
        await successFeedback(n.title, n.body, { alert: true });
      }
    }

    void poll();
    const id = setInterval(() => {
      void poll();
    }, 4000);

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void poll();
    });

    return () => {
      cancelled = true;
      clearInterval(id);
      sub.remove();
    };
  }, [enabled]);
}
