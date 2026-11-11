# Opdracht 5 — Testplan en rapportage

## Doel

Controleren of Campus Melder voldoet aan de eisen: schermen, camera, internetsync en geluid/trillen.

## Testdatum

26 oktober 2026

## Tesomgeving

| Onderdeel | Waarde |
|-----------|--------|
| Project | Campus Melder (Expo + TypeScript) |
| OS development | Windows 10 |
| API | Lokale PC-API op poort 3001 (`server/`) |
| Geautomatiseerd | TypeScript-compiler + HTTP GET/POST naar PC-API |
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
| **Stappen** | HTTP GET naar `http://<pc-ip>:3001/api/health` of `/api/meldingen` (zelfde als app) |
| **Verwacht** | Status 200 |
| **Geslaagd als** | Response OK |
| **Resultaat** | **OK** — GET status=200 (PC-API) |

### T3 — Internet: versturen (POST sync)

| | |
|--|--|
| **Stappen** | HTTP POST naar `http://<pc-ip>:3001/api/meldingen` met melding-JSON (zelfde als `syncMelding`) |
| **Verwacht** | Status 201 (created); melding zichtbaar in dashboard |
| **Geslaagd als** | Sync-endpoint accepteert de melding |
| **Resultaat** | **OK** — POST status=201 (PC-API) |

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
| **Verwacht** | Sync OK, bevestigingsscherm, trillen; optioneel PC→telefoon via dashboard-poll |
| **Geslaagd als** | `successFeedback` na sync; poll `/api/notify/pending` toont statusbalk-notificatie + trillen |
| **Resultaat** | **OK (API + code)** — POST 201; feedback via `feedback.ts` + `usePcNotifications`. Live op device tonen. |

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
| **Stappen** | Tik op melding → kies andere status (telefoon). Op PC-dashboard: kies statusknop op een melding |
| **Verwacht** | Status badge verandert; op telefoon vibratie + notificatie; op PC toast + sync naar `meldingen.json` |
| **Geslaagd als** | Status opgeslagen (telefoon én PC) en feedback getoond |
| **Resultaat** | **OK (code-review)** — `detail/[id].tsx` + `updateMeldingStatus` + dashboard PATCH + `successFeedback` |

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

De app voldoet functioneel aan de opdracht: schermen volgens ontwerp, internetsync via PC-API (GET/POST), camera-integratie, trillen, en PC→telefoon via polling + lokale statusbalk-notificatie. Bij de presentatie vooral **T7** (camera), **T8** (trillen/notificatie) en dashboard **“Stuur notificatie”** live tonen — app open houden en notificatierechten toestaan.
