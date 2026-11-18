# Opdracht 5 — Testplan en rapportage

## Doel

Controleren of Campus Melder voldoet aan de eisen: schermen, camera, internetsync en geluid/trillen.

## Regels voor dit rapport

- **Slaagcriteria** beschrijven wat je **op het scherm** ziet (of hoort/voelt), niet wat de code intern doet.
- Screenshots, logs of `.tsx`-bestanden dienen als bewijs.
- Screenshots en logs: `docs/screenshots/` (lokaal; staat in `.gitignore`).

## Testdatum

18 november 2026

## Tesomgeving

| Onderdeel | Waarde |
|-----------|--------|
| Project | Campus Melder (Expo + TypeScript) |
| OS development | Windows 10 |
| API | Lokale PC-API op poort 3001 (`server/`) |
| Geautomatiseerd | TypeScript-compiler + HTTP GET/POST naar PC-API |
| Device-UI | Expo Go op Android |

## Testplan

### T1 — App compileert / TypeScript OK

| | |
|--|--|
| **Stappen** | `cd app` → `npx tsc --noEmit` |
| **Verwacht** | Geen TypeScript-fouten in de terminal |
| **Geslaagd als** | In de terminal staat exit code 0 / geen errorregels |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T1-tsc-output.txt` |

### T2 — Internet: ophalen (GET)

| | |
|--|--|
| **Stappen** | HTTP GET naar `http://localhost:3001/api/health` |
| **Verwacht** | Antwoord met status 200; dashboard toont “API online” |
| **Geslaagd als** | Je ziet HTTP 200 / `{"ok":true,...}` en op het dashboard “API online” |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T2-get-health.txt` + `docs/screenshots/T2-dashboard-api-online.png` |

### T3 — Internet: versturen (POST sync)

| | |
|--|--|
| **Stappen** | HTTP POST naar `/api/meldingen` met melding + foto |
| **Verwacht** | Status 201; melding verschijnt op het dashboard met titel en foto |
| **Geslaagd als** | Op het dashboard staat de nieuwe melding (titel + foto zichtbaar) |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T3-post-result.txt` + `docs/screenshots/T3-T11-melding-bovenaan-met-foto.png` |

### T4 — App start en toont overzicht

| | |
|--|--|
| **Stappen** | `npx expo start` → open in Expo Go → Home |
| **Verwacht** | Titel “Campus Melder”, lijst of lege staat, knop “Nieuwe melding” |
| **Geslaagd als** | Je ziet het Home-scherm zonder crash |
| **Resultaat** | **OK** |
| **Bewijs** | `app/app/index.tsx` |

### T5 — Validatie zonder titel/beschrijving

| | |
|--|--|
| **Stappen** | Nieuwe melding → Versturen zonder titel/beschrijving |
| **Verwacht** | Alert: “Vul minimaal een titel en beschrijving in.” |
| **Geslaagd als** | Die alert-tekst staat op het scherm; er komt geen nieuwe melding in de lijst |
| **Resultaat** | **OK** |
| **Bewijs** | `app/app/nieuw.tsx` |

### T6 — Validatie zonder foto

| | |
|--|--|
| **Stappen** | Titel + beschrijving invullen, geen foto → Versturen |
| **Verwacht** | Alert: “Foto verplicht” |
| **Geslaagd als** | Die alert staat op het scherm; melding wordt niet verstuurd |
| **Resultaat** | **OK** |
| **Bewijs** | `app/app/nieuw.tsx` |

### T7 — Melding met camera/foto

| | |
|--|--|
| **Stappen** | Camera of galerij → foto → velden → Versturen |
| **Verwacht** | Foto in preview op de telefoon; na sync foto op dashboard/detail |
| **Geslaagd als** | Je ziet de foto in de preview én (na sync) op het dashboard |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T3-T11-melding-bovenaan-met-foto.png` |

### T8 — Verzenden met netwerk + vibratie/notificatie

| | |
|--|--|
| **Stappen** | Succesvol versturen met netwerk; dashboard “Stuur notificatie” met app open |
| **Verwacht** | Bevestigingsscherm; telefoon trilt; statusbalk-notificatie + trillen |
| **Geslaagd als** | Je ziet bevestiging / statusbalk-notificatie en voelt trillen |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T8-dashboard-stuur-notificatie.png` |

### T9 — Foutpad zonder netwerk

| | |
|--|--|
| **Stappen** | Wifi / vliegtuigmodus uit → melding versturen |
| **Verwacht** | Foutmelding over verzenden; optie “Lokaal opslaan” |
| **Geslaagd als** | Je ziet die fout-alert en de keuze “Lokaal opslaan”; app crasht niet |
| **Resultaat** | **OK** |
| **Bewijs** | `app/app/nieuw.tsx` |

### T10 — Status wijzigen

| | |
|--|--|
| **Stappen** | Op dashboard (of telefoon-detail) status “in behandeling” kiezen |
| **Verwacht** | Badge verandert van NIEUW naar IN BEHANDELING |
| **Geslaagd als** | Op het scherm staat de badge “IN BEHANDELING” |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T10-status-in-behandeling.png` |

### T11 — Nieuwe melding staat bovenaan

| | |
|--|--|
| **Stappen** | Nieuwe melding versturen → overzicht/dashboard bekijken |
| **Verwacht** | Nieuwste melding staat bovenaan de lijst |
| **Geslaagd als** | Je ziet de nieuwe titel bovenaan |
| **Resultaat** | **OK** |
| **Bewijs** | `docs/screenshots/T3-T11-melding-bovenaan-met-foto.png` |

## Samenvatting resultaten

| Test | Resultaat | Bewijs |
|------|-----------|--------|
| T1 TypeScript | **OK** | `T1-tsc-output.txt` |
| T2 Internet GET | **OK** | `T2-get-health.txt`, `T2-dashboard-api-online.png` |
| T3 Internet POST | **OK** | `T3-post-result.txt`, screenshot met foto |
| T4 Home start | **OK** | `app/index.tsx` |
| T5 Validatie tekst | **OK** | `nieuw.tsx` |
| T6 Validatie foto | **OK** | `nieuw.tsx` |
| T7 Camera/foto | **OK** | screenshot foto op dashboard |
| T8 Sync + feedback | **OK** | `T8-…png` |
| T9 Offline-pad | **OK** | `nieuw.tsx` |
| T10 Status | **OK** | `T10-status-in-behandeling.png` |
| T11 Bovenaan | **OK** | `T3-T11-…png` |

**Geslaagd:** 11/11

## Aanpassingen tijdens testen

| Aanpassing | Reden |
|------------|-------|
| `detail/[id].tsx`: `fotoUri ?? undefined` | TypeScript-fout T1 (uri mag geen `null` zijn) |
| Slaagcriteria in schermtaal | Niet “useFocusEffect”, wel “staat bovenaan” |
| Foto verplicht + Lokaal opslaan | Camera-flow en offline-pad aantoonbaar |

## Conclusie

Campus Melder voldoet aan de eisen: schermen, camera/foto, internetsync via PC-API, statuswijziging, offline-pad, trillen en PC→telefoon-notificatie via polling. Alle tests (T1–T11) zijn **OK**.
