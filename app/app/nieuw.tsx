import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { CATEGORIEEN, Melding, MeldingCategorie } from '../types/melding';
import { saveMelding } from '../services/storage';
import { syncMelding } from '../services/api';
import { successFeedback } from '../services/feedback';
import { uriToBase64 } from '../services/photos';
import { colors, radii, spacing } from '../constants/theme';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function NieuwScreen() {
  const router = useRouter();
  const [titel, setTitel] = useState('');
  const [categorie, setCategorie] = useState<MeldingCategorie>('Meubilair');
  const [locatie, setLocatie] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera', 'Cameratoegang is nodig om een foto te maken.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Galerij', 'Toegang tot de galerij is nodig.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
    }
  }

  async function finish(melding: Melding) {
    await saveMelding(melding);
    await successFeedback('Melding verstuurd', melding.titel);
    router.replace({ pathname: '/bevestiging', params: { id: melding.id } });
  }

  async function submit() {
    if (!titel.trim() || !beschrijving.trim()) {
      Alert.alert('Validatie', 'Vul minimaal een titel en beschrijving in.');
      return;
    }
    if (!fotoUri) {
      Alert.alert('Foto verplicht', 'Maak of kies een foto bij de melding.');
      return;
    }

    setSending(true);
    const fotoBase64 = await uriToBase64(fotoUri);
    const melding: Melding = {
      id: createId(),
      titel: titel.trim(),
      categorie,
      beschrijving: beschrijving.trim(),
      locatie: locatie.trim(),
      fotoUri,
      fotoBase64,
      status: 'nieuw',
      createdAt: new Date().toISOString(),
      synced: false,
    };

    try {
      await syncMelding(melding);
      melding.synced = true;
      await finish(melding);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout';
      Alert.alert(
        'Verzenden mislukt',
        `${message}\n\nWil je de melding lokaal opslaan zonder sync?`,
        [
          { text: 'Annuleren', style: 'cancel' },
          {
            text: 'Lokaal opslaan',
            onPress: () => {
              void finish(melding);
            },
          },
        ]
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>
        Beschrijf het probleem en voeg een foto toe via camera of galerij.
      </Text>

      <Text style={styles.label}>Titel</Text>
      <TextInput
        style={styles.input}
        value={titel}
        onChangeText={setTitel}
        placeholder="Bijv. Kapotte stoel"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Categorie</Text>
      <View style={styles.chips}>
        {CATEGORIEEN.map((cat) => {
          const active = categorie === cat;
          return (
            <Pressable
              key={cat}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategorie(cat)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Locatie</Text>
      <TextInput
        style={styles.input}
        value={locatie}
        onChangeText={setLocatie}
        placeholder="Bijv. Lokaal B2.01"
        placeholderTextColor={colors.muted}
      />

      <Text style={styles.label}>Beschrijving</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={beschrijving}
        onChangeText={setBeschrijving}
        placeholder="Wat is er aan de hand?"
        placeholderTextColor={colors.muted}
        multiline
      />

      <Text style={styles.label}>Foto</Text>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.preview} />
      ) : (
        <View style={styles.previewPlaceholder}>
          <Text style={styles.previewPlaceholderTitle}>Nog geen foto</Text>
          <Text style={styles.previewPlaceholderText}>Camera of galerij verplicht</Text>
        </View>
      )}
      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={takePhoto}>
          <Text style={styles.secondaryBtnText}>Camera</Text>
        </Pressable>
        <Pressable style={styles.ghostBtn} onPress={pickFromGallery}>
          <Text style={styles.ghostBtnText}>Galerij</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.primaryBtn, sending && styles.primaryBtnDisabled]}
        onPress={submit}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>Versturen</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: 48 },
  intro: {
    fontFamily: 'DMSans_400Regular',
    color: colors.muted,
    marginBottom: spacing.sm,
    lineHeight: 21,
  },
  label: {
    marginTop: spacing.md,
    marginBottom: 6,
    fontFamily: 'DMSans_700Bold',
    color: colors.text,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'DMSans_400Regular',
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: colors.surfaceRaised,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontFamily: 'DMSans_700Bold',
    fontSize: 13,
  },
  chipTextActive: { color: '#fff' },
  preview: {
    width: '100%',
    height: 210,
    borderRadius: radii.md,
    backgroundColor: colors.border,
  },
  previewPlaceholder: {
    height: 130,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  previewPlaceholderTitle: {
    fontFamily: 'DMSans_700Bold',
    color: colors.text,
  },
  previewPlaceholderText: {
    marginTop: 4,
    fontFamily: 'DMSans_400Regular',
    color: colors.muted,
    fontSize: 13,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.primaryMid,
    borderRadius: radii.sm,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
  },
  ghostBtn: {
    flex: 1,
    borderRadius: radii.sm,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryMid,
    backgroundColor: colors.surfaceRaised,
  },
  ghostBtnText: {
    color: colors.primaryMid,
    fontFamily: 'DMSans_700Bold',
  },
  primaryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: '#fff',
    fontFamily: 'DMSans_700Bold',
    fontSize: 16,
  },
});
