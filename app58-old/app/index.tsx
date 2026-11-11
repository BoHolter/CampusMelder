import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { MeldingCard } from '../components/MeldingCard';
import { getMeldingen } from '../services/storage';
import { fetchRemotePing } from '../services/api';
import { Melding } from '../types/melding';
import { colors } from '../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [meldingen, setMeldingen] = useState<Melding[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, ping] = await Promise.all([getMeldingen(), fetchRemotePing()]);
      setMeldingen(list);
      setOnline(ping);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Overzicht meldingen</Text>
        <Text style={styles.bannerSub}>
          Netwerk:{' '}
          {online === null ? 'controleren…' : online ? 'online (sync OK)' : 'offline / geen sync'}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={meldingen}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nog geen meldingen. Tik op “Nieuwe melding” om te starten.
            </Text>
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
        style={styles.fab}
        onPress={() => router.push('/nieuw')}
        accessibilityRole="button"
      >
        <Text style={styles.fabText}>+ Nieuwe melding</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  bannerSub: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 48,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
