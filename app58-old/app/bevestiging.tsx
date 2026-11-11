import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/theme';

export default function BevestigingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>Melding verstuurd!</Text>
      <Text style={styles.body}>
        Je melding is opgeslagen. Het apparaat heeft getrild en er is een notificatie
        getoond (geluid/trillen — hardwarefeedback).
      </Text>
      {id ? <Text style={styles.id}>Referentie: {id}</Text> : null}

      <Pressable style={styles.btn} onPress={() => router.replace('/')}>
        <Text style={styles.btnText}>Terug naar overzicht</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { color: '#fff', fontSize: 40, fontWeight: '800' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 12,
  },
  id: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  btnText: { color: '#fff', fontWeight: '800' },
});
