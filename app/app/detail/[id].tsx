import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBadge } from '../../components/StatusBadge';
import { getMeldingById, updateMeldingStatus } from '../../services/storage';
import { successFeedback } from '../../services/feedback';
import { Melding, MeldingStatus, STATUSSEN } from '../../types/melding';
import { colors, radii, spacing } from '../../constants/theme';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('nl-NL');
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [melding, setMelding] = useState<Melding | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const item = await getMeldingById(String(id));
      setMelding(item);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  async function changeStatus(status: MeldingStatus) {
    if (!melding || melding.status === status) return;
    setUpdating(true);
    try {
      const updated = await updateMeldingStatus(melding.id, status);
      if (!updated) return;
      setMelding(updated);
      await successFeedback('Status bijgewerkt', `"${updated.titel}" is nu: ${status}`, {
        alert: true,
      });
    } catch (error) {
      Alert.alert(
        'Fout',
        error instanceof Error ? error.message : 'Status wijzigen mislukt'
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />;
  }

  if (!melding) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Melding niet gevonden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {melding.fotoUri || melding.fotoBase64 ? (
        <Image
          source={{
            uri:
              melding.fotoUri &&
              /^(file|content|https?|data|ph|assets-library):/i.test(melding.fotoUri)
                ? melding.fotoUri
                : melding.fotoBase64
                  ? `data:image/jpeg;base64,${melding.fotoBase64}`
                  : melding.fotoUri ?? undefined,
          }}
          style={styles.photo}
        />
      ) : (
        <View style={[styles.photo, styles.photoMissing]}>
          <Text style={{ color: colors.muted, fontFamily: 'DMSans_400Regular' }}>Geen foto</Text>
        </View>
      )}

      <StatusBadge status={melding.status} />
      <Text style={styles.title}>{melding.titel}</Text>

      <View style={styles.metaBox}>
        <Text style={styles.meta}>Categorie · {melding.categorie}</Text>
        {melding.locatie ? <Text style={styles.meta}>Locatie · {melding.locatie}</Text> : null}
        <Text style={styles.meta}>{formatDate(melding.createdAt)}</Text>
        <Text style={styles.meta}>
          Sync · {melding.synced ? 'gesynchroniseerd' : 'alleen lokaal'}
        </Text>
      </View>

      <Text style={styles.description}>{melding.beschrijving}</Text>

      <Text style={styles.section}>Status wijzigen</Text>
      {updating ? <ActivityIndicator color={colors.primary} style={{ marginBottom: 8 }} /> : null}
      <View style={styles.statusRow}>
        {STATUSSEN.map((status) => {
          const active = melding.status === status;
          return (
            <Pressable
              key={status}
              style={[styles.statusBtn, active && styles.statusBtnActive]}
              disabled={updating}
              onPress={() => changeStatus(status)}
            >
              <Text style={[styles.statusBtnText, active && styles.statusBtnTextActive]}>
                {status}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { color: colors.muted, fontFamily: 'DMSans_400Regular' },
  photo: {
    width: '100%',
    height: 240,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
  },
  photoMissing: { alignItems: 'center', justifyContent: 'center' },
  title: {
    marginTop: 12,
    fontSize: 28,
    fontFamily: 'Fraunces_700Bold',
    color: colors.text,
  },
  metaBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  meta: {
    color: colors.muted,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  description: {
    marginTop: spacing.md,
    fontSize: 16,
    lineHeight: 25,
    color: colors.text,
    fontFamily: 'DMSans_400Regular',
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: 12,
    fontFamily: 'DMSans_700Bold',
    color: colors.primary,
    fontSize: 15,
  },
  statusRow: { gap: 10 },
  statusBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.sm,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  statusBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusBtnText: {
    color: colors.text,
    fontFamily: 'DMSans_700Bold',
    textTransform: 'capitalize',
  },
  statusBtnTextActive: { color: '#fff' },
});
