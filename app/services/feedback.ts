import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Alert, PermissionsAndroid, Platform, Vibration } from 'react-native';

/**
 * Lokale Android-notificatie in het meldingenpaneel (shade).
 * Geen cloud-push; in Expo Go staat de afzender als "Expo Go".
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = 'campus-melder';

let channelReady = false;
let permissionsReady: boolean | null = null;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Campus Melder meldingen',
    description: 'Meldingen vanaf de PC en statusupdates',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 150, 250],
    sound: 'default',
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
  });
  channelReady = true;
}

async function ensureAndroidPostNotifications(): Promise<boolean> {
  if (Platform.OS !== 'android' || Platform.Version < 33) return true;
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

export async function requestFeedbackPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    permissionsReady = false;
    return false;
  }
  try {
    const androidOk = await ensureAndroidPostNotifications();
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync({
        android: {},
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      status = requested.status;
    }
    await ensureAndroidChannel();
    permissionsReady = androidOk && status === 'granted';
    return permissionsReady;
  } catch (error) {
    console.warn('[CampusMelder] notificatie-permissie mislukt', error);
    permissionsReady = false;
    return false;
  }
}

export async function vibrateDevice(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // ignore
  }
  if (Platform.OS !== 'web') {
    Vibration.vibrate([0, 220, 100, 220]);
  }
}

/** Zet een melding in het Android-meldingenpaneel. */
export async function notifyUser(title: string, body: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    if (permissionsReady !== true) {
      const ok = await requestFeedbackPermissions();
      if (!ok) {
        throw new Error('Geen toestemming voor meldingen (Expo Go → Meldingen aan)');
      }
    }
    await ensureAndroidChannel();

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        sticky: false,
        autoDismiss: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        ...(Platform.OS === 'android'
          ? { channelId: CHANNEL_ID, color: '#0B3D2E' }
          : {}),
      },
      // null = meteen tonen in banner + meldingenlijst
      trigger: null,
    });
    return true;
  } catch (error) {
    console.warn('[CampusMelder] lokale notificatie mislukt', error);
    return false;
  }
}

/** Trillen + melding in het paneel. Alert alleen als dat mislukt. */
export async function successFeedback(
  title: string,
  body: string,
  options?: { alert?: boolean }
): Promise<void> {
  await vibrateDevice();
  const shown = await notifyUser(title, body);
  if (!shown && options?.alert !== false) {
    Alert.alert(
      title,
      `${body}\n\nKon geen melding in de meldingenbalk zetten. Zet meldingen aan voor Expo Go.`
    );
  }
}
