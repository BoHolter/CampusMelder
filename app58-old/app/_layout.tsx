import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { requestFeedbackPermissions } from '../services/feedback';
import { colors } from '../constants/theme';

export default function RootLayout() {
  useEffect(() => {
    void requestFeedbackPermissions();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Campus Melder' }} />
        <Stack.Screen name="nieuw" options={{ title: 'Nieuwe melding' }} />
        <Stack.Screen name="bevestiging" options={{ title: 'Bevestiging', headerBackVisible: false }} />
        <Stack.Screen name="detail/[id]" options={{ title: 'Melding detail' }} />
      </Stack>
    </>
  );
}
