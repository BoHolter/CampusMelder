# Opdracht 3 — Ontwerp

## Navigatie

```
Home (overzicht) ──► Nieuwe melding ──► Bevestiging ──► Home
       │
       └──► Detail (status wijzigen) ──► Home
```

## Schermen (visuele weergave)

### 1. Home / Overzicht

```
┌─────────────────────────────┐
│  Campus Melder              │
│  Overzicht meldingen        │
├─────────────────────────────┤
│  [● nieuw] Kapotte stoel    │
│  Meubilair · Lokaal B2.01   │
│  26-10-2026                 │
├─────────────────────────────┤
│  [○ in behandeling] Graffiti│
│  Schoonmaak · Gang A        │
│  25-10-2026                 │
├─────────────────────────────┤
│                             │
│     [ + Nieuwe melding ]    │
└─────────────────────────────┘
```

**Functie:** lijst van meldingen tonen; tikken opent detail; knop opent nieuw-formulier.

### 2. Nieuwe melding

```
┌─────────────────────────────┐
│  ← Nieuwe melding           │
├─────────────────────────────┤
│  Titel                      │
│  [________________________] │
│                             │
│  Categorie                  │
│  [ Meubilair          ▼ ]   │
│                             │
│  Locatie                    │
│  [________________________] │
│                             │
│  Beschrijving               │
│  [________________________] │
│  [________________________] │
│                             │
│  Foto                       │
│  ┌─────────┐                │
│  │ 📷   │  [Camera]      │
│  └─────────┘  [Galerij]     │
│                             │
│     [ Versturen ]           │
└─────────────────────────────┘
```

**Functie:** formulier + camera/galerij; bij versturen sync via internet + vibratie/notificatie.

### 3. Bevestiging

```
┌─────────────────────────────┐
│                             │
│         ✓                   │
│   Melding verstuurd!        │
│                             │
│  Je melding is opgeslagen   │
│  en gesynchroniseerd.       │
│                             │
│  (apparaat trilt +          │
│   notificatie verschijnt)   │
│                             │
│   [ Terug naar overzicht ]  │
└─────────────────────────────┘
```

### 4. Detail

```
┌─────────────────────────────┐
│  ← Melding detail           │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │       [foto]          │  │
│  └───────────────────────┘  │
│                             │
│  Kapotte stoel              │
│  Status: nieuw              │
│  Categorie: Meubilair       │
│  Locatie: Lokaal B2.01      │
│  26-10-2026 14:32           │
│                             │
│  Stoelpot is afgebroken...  │
│                             │
│  Status wijzigen            │
│  [ nieuw ]                  │
│  [ in behandeling ]         │
│  [ afgerond ]               │
└─────────────────────────────┘
```

**Functie:** details tonen; statuswijziging triggert opnieuw vibratie + notificatie.  
Status wijzigen kan ook op het **PC-dashboard** (zelfde statusflow via PATCH).

## Database-ontwerp

Eén entiteit is voldoende voor deze opdracht.

### Tabel: `meldingen`

| Veld | Type | Verplicht | Beschrijving |
|------|------|-----------|--------------|
| id | string (UUID) | ja | Unieke sleutel |
| titel | string | ja | Korte titel |
| categorie | string | ja | Meubilair / Schoonmaak / ICT / Overig |
| beschrijving | string | ja | Toelichting |
| locatie | string | nee | Vrij tekstveld (lokaal, gang, …) |
| fotoUri | string | nee | Pad/URI van de foto |
| status | string | ja | `nieuw` \| `in behandeling` \| `afgerond` |
| createdAt | string (ISO) | ja | Aanmaakdatum/-tijd |
| synced | boolean | ja | Of sync met API gelukt is |

### Statusflow

```
nieuw ──► in behandeling ──► afgerond
```

### Opslag & sync

- **Lokaal:** AsyncStorage (cache / offline-lijst)
- **Internet:** `fetch` naar de **lokale PC-API** (`server/` op poort 3001, bestand `meldingen.json`) — ophalen (GET) en versturen (POST/PATCH) over wifi
- **Notificatie PC → telefoon:** bericht in wachtrij (`pending-notifications.json`); app pollt en toont lokale statusbalk-notificatie + trillen (geen cloud-push; zie `docs/04-ontwikkelomgeving.md`)

## Akkoord opdrachtgever

| Onderdeel | Besluit | Datum | Handtekening |
|-----------|---------|-------|--------------|
| Schermontwerp (4 schermen) | ☐ Akkoord / ☐ Aanpassen | …… | …… |
| Datamodel `meldingen` | ☐ Akkoord | …… | …… |
