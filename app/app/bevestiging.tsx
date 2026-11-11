import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radii, spacing } from '../constants/theme';

export default function BevestigingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primarySoft]}
        style={styles.card}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>Melding verstuurd</Text>
        <Text style={styles.body}>
          Je melding is opgeslagen. Het apparaat heeft getrild als hardwarefeedback.
        </Text>
        {id ? <Text style={styles.id}>Ref: {id}</Text> : null}
      </LinearGradient>

      <Pressable style={styles.btn} onPress={() => router.replace('/')}>
        <Text style={styles.btnText}>Terug naar overzicht</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  icon: { color: '#fff', fontSize: 34, fontFamily: 'DMSans_700Bold' },
  title: {
    fontSize: 28,
    fontFamily: 'Fraunces_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
    fontFamily: 'DMSans_400Regular',
  },
  id: {
    marginTop: 14,
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'DMSans_400Regular',
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontFamily: 'DMSans_700Bold', fontSize: 16 },
});
