import { StyleSheet, Text, View } from 'react-native';
import { MeldingStatus } from '../types/melding';
import { colors, radii, statusColor } from '../constants/theme';

type Props = { status: MeldingStatus };

export function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: statusColor[status] ?? colors.muted }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontFamily: 'DMSans_700Bold',
  },
});
