import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Melding } from '../types/melding';
import { StatusBadge } from './StatusBadge';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  melding: Melding;
  onPress: () => void;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: 'short',
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
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <StatusBadge status={melding.status} />
        {!melding.synced ? <Text style={styles.syncWarn}>lokaal</Text> : null}
      </View>
      <Text style={styles.title}>{melding.titel}</Text>
      <Text style={styles.meta}>
        {melding.categorie}
        {melding.locatie ? `  ·  ${melding.locatie}` : ''}
      </Text>
      <Text style={styles.date}>{formatDate(melding.createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 12,
    fontSize: 19,
    fontFamily: 'Fraunces_700Bold',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
    fontFamily: 'DMSans_400Regular',
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: colors.muted,
    fontFamily: 'DMSans_400Regular',
  },
  syncWarn: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '700',
    fontFamily: 'DMSans_700Bold',
    textTransform: 'uppercase',
  },
});
