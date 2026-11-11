# Campus Melder (Expo)

Mobiele app voor de opdracht Mobile App — ROC van Flevoland.

## Starten

```bash
cd app
npm install
npx expo start
```

Scan daarna de QR-code met **Expo Go** op je telefoon, of start een emulator (`a` voor Android).

## Hardwarefuncties

| Functie | Implementatie |
|---------|---------------|
| Camera | `expo-image-picker` (camera + galerij) |
| Internet | `fetch` naar JSONPlaceholder + `expo-network` |
| Geluid/trillen | `expo-notifications` (geluid) + `expo-haptics` / Vibration |

## Waarom Expo?

- Snel te presenteren op een echt device
- Kant-en-klare modules voor camera, notificaties en haptics
- TypeScript + één codebase, goed te tonen en toe te lichten
