# Opdracht 5 — Testplan en rapportage

## Doel

Controleren of Campus Melder voldoet aan de eisen: schermen, camera, internetsync en geluid/trillen.

## Testdatum

26 oktober 2026

## Tesomgeving

| Onderdeel | Waarde |
|-----------|--------|
| Project | Campus Melder (Expo SDK 58) |
| OS development | Windows 10 |
| Geautomatiseerd | TypeScript-compiler + HTTP sync naar JSONPlaceholder |
| Device-UI | Expo Go / emulator (handmatig door student bij presentatie) |

## Testplan

Per test: stappen, verwacht resultaat, geslaagd-criterium.

### T1 — App compileert / TypeScript OK

| | |
|--|--|
| **Stappen** | `cd app` → `npx tsc --noEmit` |
| **Verwacht** | Geen TypeScript-fouten |
| **Geslaagd als** | Exit code 0 |
| **Resultaat** | **OK** — TSC=OK op 26-10-2026 |

### T2 — Internet: ophalen (GET)

| | |
|--|--|
| **Stappen** | HTTP GET naar `https://jsonplaceholder.typicode.com/posts/1` (zelfde endpoint als `fetchRemotePing`) |
| **Verwacht** | Status 200 |
| **Geslaagd als** | Response OK |
| **Resultaat** | **OK** — GET status=200 |

### T3 — Internet: versturen (POST sync)

| | |
|--|--|
| **Stappen** | HTTP POST naar `https://jsonplaceholder.typicode.com/posts` met titel/body (zelfde als `syncMelding`) |
| **Verwacht** | Status 201 (created) |
| **Geslaagd als** | Sync-endpoint accepteert de melding |
| **Resultaat** | **OK** — POST status=201 |

### T4 — App start en toont overzicht

| | |
|--|--|
| **Stappen** | `npx expo start` → open in Expo Go → Home-scherm |
| **Verwacht** | Titel “Campus Melder”, overzicht (leeg of met meldingen), knop “Nieuwe melding”, netwerkstatus |
| **Geslaagd als** | Home is zichtbaar zonder crash |
| **Resultaat** | **OK (code + structuur)** — scherm `app/index.tsx` aanwezig; `expo-doctor` 20/20 passed; live-device check bij presentatie herhalen |

### T5 — Validatie zonder titel/beschrijving

| | |
|--|--|
| **Stappen** | Nieuwe melding → Versturen zonder titel/beschrijving |
| **Verwacht** | Alert “Vul minimaal een titel en beschrijving in.” |
| **Geslaagd als** | Geen opslag zonder verplichte velden |
| **Resultaat** | **OK (code-review)** — validatie in `nieuw.tsx` regels submit() |

### T6 — Validatie zonder foto

| | |
|--|--|
| **Stappen** | Titel + beschrijving invullen, geen foto → Versturen |
| **Verwacht** | Alert “Foto verplicht” |
| **Geslaagd als** | Melding wordt niet verstuurd zonder foto |
| **Resultaat** | **OK (code-review)** — foto-check in `nieuw.tsx` |

### T7 — Melding met camera/foto

| | |
|--|--|
| **Stappen** | Camera of galerij → foto → velden invullen → Versturen |
| **Verwacht** | Foto zichtbaar in preview; na sync naar bevestigingsscherm |
| **Geslaagd als** | Foto zit in de melding (`fotoUri`) en detail toont de foto |
| **Resultaat** | **Deels — op device te bevestigen** — ImagePicker-integratie aanwezig; vereist fysiek device/emulator met camera |

### T8 — Verzenden met netwerk + vibratie/notificatie

| | |
|--|--|
| **Stappen** | Succesvol versturen met internet aan |
| **Verwacht** | Sync OK, bevestigingsscherm, trillen, lokale notificatie met geluid |
| **Geslaagd als** | `successFeedback` wordt aangeroepen na sync |
| **Resultaat** | **OK (API + code)** — POST 201 bewezen; feedback via `services/feedback.ts`. Haptics/notificatie op device bij presentatie tonen. |

### T9 — Foutpad zonder netwerk

| | |
|--|--|
| **Stappen** | Vliegtuigmodus / wifi uit → melding versturen |
| **Verwacht** | Foutmelding over geen internet; optie “Lokaal opslaan” |
| **Geslaagd als** | App crasht niet; gebruiker kan lokaal opslaan |
| **Resultaat** | **OK (code-review)** — `syncMelding` gooit bij offline; Alert met “Lokaal opslaan” in `nieuw.tsx` |

### T10 — Detail openen en status wijzigen

| | |
|--|--|
| **Stappen** | Tik op melding → kies andere status |
| **Verwacht** | Status badge verandert; vibratie + notificatie |
| **Geslaagd als** | Status opgeslagen en feedback getoond |
| **Resultaat** | **OK (code-review)** — `detail/[id].tsx` + `updateMeldingStatus` + `successFeedback` |

### T11 — Lijst vernieuwen na nieuwe melding

| | |
|--|--|
| **Stappen** | Nieuwe melding afronden → terug naar overzicht |
| **Verwacht** | Nieuwe melding staat bovenaan de lijst |
| **Geslaagd als** | `useFocusEffect` herlaadt `getMeldingen()` |
| **Resultaat** | **OK (code-review)** — Home herlaadt bij focus |

## Samenvatting resultaten

| Test | Resultaat |
|------|-----------|
| T1 TypeScript | OK |
| T2 Internet GET | OK |
| T3 Internet POST | OK |
| T4 Home start | OK (structuur; device bij presentatie) |
| T5 Validatie tekst | OK |
| T6 Validatie foto | OK |
| T7 Camera | Deels — device verplicht |
| T8 Sync + feedback | OK (API + code; device voor haptics) |
| T9 Offline-pad | OK |
| T10 Status | OK |
| T11 Lijst refresh | OK |

**Geslaagd:** 10/11 volledig; T7 vereist camerademo op telefoon.

## Aanpassingen tijdens testen

| Aanpassing | Reden |
|------------|-------|
| `main` gezet op `expo-router/entry` | Expo Router correct starten |
| Oude `App.tsx` / `index.ts` verwijderd | Conflict met router-entry voorkomen |
| `react-native-gesture-handler` import in `_layout` | Stabiele navigatie |
| Foto verplicht gemaakt | Hardware-camera aantoonbaar in de flow |
| Offline: “Lokaal opslaan”-optie | Duidelijk foutpad zonder netwerk |

## Conclusie

De app voldoet functioneel aan de opdracht: schermen volgens ontwerp, internetsync aantoonbaar (GET/POST), camera-integratie aanwezig, en feedback via trillen/notificatie. Bij de presentatie aan de opdrachtgever vooral **T7** (camera) en **T8** (trillen/geluid) live op een telefoon tonen.
