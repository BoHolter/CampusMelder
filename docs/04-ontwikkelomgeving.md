# Opdracht 4 — Keuze ontwikkelomgeving

## Gekozen omgeving: Expo (React Native) + TypeScript

### Waarom deze keuze?

1. **Geschikt voor mobile** — één codebase die op Android (en iOS) draait; presentatie op telefoon via Expo Go of emulator.
2. **Hardware out-of-the-box** — camera (`expo-image-picker`), internet (`fetch` + `expo-network`), geluid/trillen (`expo-notifications`, `expo-haptics`).
3. **Snel te demonstreren** — geen zware native toolchain nodig voor een schoolpresentatie.
4. **Leesbare code** — TypeScript-types voor meldingen, statussen en services; makkelijk toe te lichten aan de opdrachtgever.
5. **Past bij het ontwerp** — Expo Router voor de vier goedgekeurde schermen.

### Alternatieven (niet gekozen)

| Alternatief | Reden niet gekozen |
|-------------|--------------------|
| Native Android (Kotlin) | Alleen Android; meer setup voor camera/notificaties |
| Flutter | Sterk, maar team/lescontext sluit beter aan bij JS/TS |
| Progressive Web App | Minder overtuigende hardware-demo (camera/trillen beperkter) |

### Projectstructuur (code)

```
app/
  app/           # Schermen (Expo Router)
  components/    # UI-componenten
  services/      # storage, api, feedback (hardware)
  types/         # Melding-model
```
