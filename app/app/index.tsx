import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { MeldingCard } from '../components/MeldingCard';
import { getMeldingen } from '../services/storage';
import { fetchRemotePing } from '../services/api';
import { notifyUser, vibrateDevice } from '../services/feedback';
import { Melding } from '../types/melding';
import { colors, radii, spacing } from '../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [meldingen, setMeldingen] = useState<Melding[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const [list, ping] = await Promise.all([getMeldingen(), fetchRemotePing()]);
      setMeldingen(list);
      setOnline(ping);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
      // Stille sync: geen spinner/flikker, alleen data bijwerken
      const id = setInterval(() => {
        void load({ silent: true });
      }, 8000);
      return () => clearInterval(id);
    }, [load])
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.brand}>Campus Melder</Text>
        <Text style={styles.heroTitle}>Meld het,{'\n'}fix het op.</Text>
        <View style={styles.statusPill}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  online === null
                    ? colors.accentSoft
                    : online
                      ? '#7DFFB3'
                      : '#FF8A80',
              },
            ]}
          />
          <Text style={styles.statusText}>
            {online === null
              ? 'Netwerk controleren…'
              : online
                ? 'Online — sync beschikbaar'
                : 'Offline — lokaal opslaan mogelijk'}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Jouw meldingen</Text>
        <Text style={styles.sectionCount}>{meldingen.length}</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={meldingen}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nog niets gemeld</Text>
              <Text style={styles.emptyBody}>
                Tik op de knop hieronder om je eerste campusmelding te maken met foto.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MeldingCard
              melding={item}
              onPress={() => router.push(`/detail/${item.id}`)}
            />
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.testBtn, pressed && { opacity: 0.85 }]}
        onPress={async () => {
          await vibrateDevice();
          const ok = await notifyUser(
            'Test vanaf telefoon',
            'Als dit werkt, zie je deze melding in je meldingenbalk (bij Expo Go).'
          );
          if (!ok) {
            Alert.alert(
              'Melding mislukt',
              'Zet meldingen aan: Instellingen → Apps → Expo Go → Meldingen.'
            );
          }
        }}
        accessibilityRole="button"
      >
        <Text style={styles.testBtnText}>Test meldingenbalk</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9 }]}
        onPress={() => router.push('/nieuw')}
        accessibilityRole="button"
      >
        <Text style={styles.fabText}>+  Nieuwe melding</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg + 4,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: radii.lg,
  },
  brand: {
    color: colors.accentSoft,
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 8,
    color: '#fff',
    fontFamily: 'Fraunces_700Bold',
    fontSize: 34,
    lineHeight: 40,
  },
  statusPill: {
    marginTop: 16,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    color: '#fff',
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
  },
  sectionHead: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
    color: colors.text,
  },
  sectionCount: {
    fontFamily: 'DMSans_700Bold',
    color: colors.muted,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: 160,
  },
  testBtn: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 88,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  testBtnText: {
    color: colors.primary,
    fontFamily: 'DMSans_700Bold',
    fontSize: 14,
  },
  emptyBox: {
    marginTop: 28,
    padding: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: 'DMSans_400Regular',
    color: colors.muted,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 24,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
});
