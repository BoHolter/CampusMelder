import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '../constants/theme';
import { usePcNotifications } from '../hooks/usePcNotifications';
import { requestFeedbackPermissions } from '../services/feedback';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    Fraunces_700Bold,
  });
  const [notifyReady, setNotifyReady] = useState(false);

  usePcNotifications(loaded && notifyReady);

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    (async () => {
      await requestFeedbackPermissions();
      if (!cancelled) setNotifyReady(true);
      SplashScreen.hideAsync().catch(() => undefined);
    })();
    return () => {
      cancelled = true;
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'DMSans_700Bold',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Campus Melder' }} />
        <Stack.Screen name="nieuw" options={{ title: 'Nieuwe melding' }} />
        <Stack.Screen
          name="bevestiging"
          options={{ title: 'Verstuurd', headerBackVisible: false }}
        />
        <Stack.Screen name="detail/[id]" options={{ title: 'Detail' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
