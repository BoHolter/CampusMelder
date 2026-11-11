import { StyleSheet, Text, View } from 'react-native';
import { MeldingStatus } from '../types/melding';
import { statusColor } from '../constants/theme';

type Props = { status: MeldingStatus };

export function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: statusColor[status] ?? '#888' }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
