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
import { getMeldingById, saveMelding, updateMeldingStatus } from '../../services/storage';
import { syncMelding } from '../../services/api';
import { successFeedback } from '../../services/feedback';
import { Melding, MeldingStatus, STATUSSEN } from '../../types/melding';
import { colors } from '../../constants/theme';

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

      try {
        await syncMelding(updated);
        updated.synced = true;
        await saveMelding(updated);
      } catch {
        // Status lokaal gewijzigd; sync optioneel
      }

      setMelding(updated);
      await successFeedback(
        'Status bijgewerkt',
        `"${updated.titel}" is nu: ${status}`
      );
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
      {melding.fotoUri ? (
        <Image source={{ uri: melding.fotoUri }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoMissing]}>
          <Text style={{ color: colors.muted }}>Geen foto</Text>
        </View>
      )}

      <StatusBadge status={melding.status} />
      <Text style={styles.title}>{melding.titel}</Text>
      <Text style={styles.meta}>Categorie: {melding.categorie}</Text>
      {melding.locatie ? <Text style={styles.meta}>Locatie: {melding.locatie}</Text> : null}
      <Text style={styles.meta}>{formatDate(melding.createdAt)}</Text>
      <Text style={styles.meta}>
        Sync: {melding.synced ? 'gesynchroniseerd' : 'lokaal (niet gesync)'}
      </Text>

      <Text style={styles.description}>{melding.beschrijving}</Text>

      <Text style={styles.section}>Status wijzigen</Text>
      {updating ? <ActivityIndicator color={colors.primary} /> : null}
      <View style={styles.statusRow}>
        {STATUSSEN.map((status) => (
          <Pressable
            key={status}
            style={[
              styles.statusBtn,
              melding.status === status && styles.statusBtnActive,
            ]}
            disabled={updating}
            onPress={() => changeStatus(status)}
          >
            <Text
              style={[
                styles.statusBtnText,
                melding.status === status && styles.statusBtnTextActive,
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { color: colors.muted },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.border,
  },
  photoMissing: { alignItems: 'center', justifyContent: 'center' },
  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  meta: { marginTop: 4, color: colors.muted },
  description: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  section: {
    marginTop: 28,
    marginBottom: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  statusRow: { gap: 10 },
  statusBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statusBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusBtnText: { color: colors.text, fontWeight: '600', textTransform: 'capitalize' },
  statusBtnTextActive: { color: '#fff' },
});
