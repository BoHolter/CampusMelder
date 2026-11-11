import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Melding } from '../types/melding';
import { StatusBadge } from './StatusBadge';
import { colors } from '../constants/theme';

type Props = {
  melding: Melding;
  onPress: () => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function MeldingCard({ melding, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <StatusBadge status={melding.status} />
      <Text style={styles.title}>{melding.titel}</Text>
      <Text style={styles.meta}>
        {melding.categorie}
        {melding.locatie ? ` · ${melding.locatie}` : ''}
      </Text>
      <Text style={styles.date}>{formatDate(melding.createdAt)}</Text>
      {!melding.synced ? (
        <Text style={styles.syncWarn}>Nog niet gesynchroniseerd</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: colors.muted,
  },
  syncWarn: {
    marginTop: 6,
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
});
