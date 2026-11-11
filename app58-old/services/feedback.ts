import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

let channelReady = false;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelReady) return;
  await Notifications.setNotificationChannelAsync('campus-melder', {
    name: 'Campus Melder',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 150, 250],
    sound: 'default',
  });
  channelReady = true;
}

export async function requestFeedbackPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') {
      await ensureAndroidChannel();
      return true;
    }
    const { status } = await Notifications.requestPermissionsAsync();
    await ensureAndroidChannel();
    return status === 'granted';
  } catch {
    return false;
  }
}

/** Trilt het apparaat (haptics + Vibration fallback). */
export async function vibrateDevice(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(400);
    }
  }
}

/** Lokale notificatie met geluid. */
export async function notifyUser(title: string, body: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') new Notification(title, { body });
      }
    }
    return;
  }
  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: 'campus-melder' } : {}),
    },
    trigger: null,
  });
}

/** Combinatie: trillen + notificatie (hardware-feedback). */
export async function successFeedback(title: string, body: string): Promise<void> {
  await vibrateDevice();
  await notifyUser(title, body);
}
