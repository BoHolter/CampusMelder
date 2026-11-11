import * as Haptics from 'expo-haptics';
import { Alert, Platform, Vibration } from 'react-native';

/**
 * Hardware-feedback zonder expo-notifications
 * (Expo Go mist ExpoTopicSubscriptionModule).
 */

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

/** Trillen + optionele Alert (gebruik Alert alleen als er geen eigen scherm is). */
export async function successFeedback(
  title: string,
  body: string,
  options?: { alert?: boolean }
): Promise<void> {
  await vibrateDevice();
  if (options?.alert) {
    Alert.alert(title, body);
  }
}
