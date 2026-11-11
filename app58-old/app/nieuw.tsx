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
import { colors } from '../constants/theme';

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

  async function submit() {
    if (!titel.trim() || !beschrijving.trim()) {
      Alert.alert('Validatie', 'Vul minimaal een titel en beschrijving in.');
      return;
    }
    if (!fotoUri) {
      Alert.alert('Foto verplicht', 'Maak of kies een foto bij de melding (camera-hardware).');
      return;
    }

    setSending(true);
    const melding: Melding = {
      id: createId(),
      titel: titel.trim(),
      categorie,
      beschrijving: beschrijving.trim(),
      locatie: locatie.trim(),
      fotoUri,
      status: 'nieuw',
      createdAt: new Date().toISOString(),
      synced: false,
    };

    try {
      await syncMelding(melding);
      melding.synced = true;
      await saveMelding(melding);
      await successFeedback(
        'Melding verstuurd',
        `"${melding.titel}" is opgeslagen en gesynchroniseerd.`
      );
      router.replace({ pathname: '/bevestiging', params: { id: melding.id } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout';
      Alert.alert(
        'Verzenden mislukt',
        `${message}\n\nWil je de melding lokaal opslaan zonder sync?`,
        [
          { text: 'Annuleren', style: 'cancel' },
          {
            text: 'Lokaal opslaan',
            onPress: async () => {
              await saveMelding(melding);
              await successFeedback(
                'Melding lokaal opgeslagen',
                `"${melding.titel}" is opgeslagen (nog niet gesynchroniseerd).`
              );
              router.replace({ pathname: '/bevestiging', params: { id: melding.id } });
            },
          },
        ]
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
        {CATEGORIEEN.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.chip, categorie === cat && styles.chipActive]}
            onPress={() => setCategorie(cat)}
          >
            <Text style={[styles.chipText, categorie === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
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
        placeholder="Beschrijf het probleem…"
        placeholderTextColor={colors.muted}
        multiline
      />

      <Text style={styles.label}>Foto (camera)</Text>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.preview} />
      ) : (
        <View style={styles.previewPlaceholder}>
          <Text style={styles.previewPlaceholderText}>Nog geen foto</Text>
        </View>
      )}
      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={takePhoto}>
          <Text style={styles.secondaryBtnText}>Camera</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={pickFromGallery}>
          <Text style={styles.secondaryBtnText}>Galerij</Text>
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
  container: { padding: 16, paddingBottom: 40 },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  previewPlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  previewPlaceholderText: { color: colors.muted },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  secondaryBtn: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#fff', fontWeight: '700' },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
