# Opdracht 4 — Keuze ontwikkelomgeving

## Gekozen stack (kort)

| Laag | Keuze | Taal |
|------|--------|------|
| Mobiele app | **Expo** op **React Native** | **TypeScript** (superset van JavaScript) |
| UI / device-API’s | React Native + Expo-modules | TypeScript |
| PC-API + dashboard | Express (Node.js) | JavaScript |
| Data | JSON-bestand op de PC + AsyncStorage op de telefoon | — |

**Native-platform:** de app draait als **Android-app** (via Expo Go). React Native vertaalt onze TypeScript/JS naar echte native UI-componenten op Android. We schrijven dus geen Kotlin/Java zelf, maar gebruiken wel de native hardware (camera, vibratie) via Expo-bruggen.

---

## Programmeertaal op mobiel: waarom TypeScript?

1. **TypeScript** = JavaScript + types → minder fouten, makkelijker uit te leggen (`Melding`, statussen, API-responses).
2. Past bij React Native / Expo (standaard in tutorials en schoolcontext JS/TS).
3. Eén taal voor app-logica én (bijna) dezelfde mentaliteit als de PC-server in Node.

**Niet gekozen:** Kotlin (alleen Android, andere lesstof), Dart (Flutter), Swift (alleen iOS).

---

## Waarom Expo / React Native — en niet de andere?

| Optie | Wat het is | Waarom wel / niet |
|-------|------------|-------------------|
| **Expo + React Native (gekozen)** | Cross-platform framework; hardware via modules; demo met Expo Go | Snel presenteren op telefoon; camera, netwerk, trillen beschikbaar; één codebase; past bij TypeScript |
| **Native Android (Kotlin)** | Echte Android-app in Android Studio | Sterk, maar alleen Android, meer setup (SDK, emulators, permissies), langer voor dezelfde demo |
| **Flutter (Dart)** | Cross-platform van Google | Goed voor UI, maar team/lescontext is JS/TS — extra taal leren kost te veel tijd |
| **PWA (alleen browser)** | Website “als app” | Camera/trillen zwakker of inconsistenter op telefoon; minder overtuigende hardware-demo |

### Wat bedoelen we met “native”?

- We bouwen **geen** pure Kotlin/Swift-app.
- We gebruiken wel **native device-features** via Expo:
  - Camera / galerij → `expo-image-picker`
  - Trillen → `expo-haptics` + React Native `Vibration`
  - Internet → `fetch` naar onze PC-API
- **Expo Go** levert die native modules al gebundeld; daarom kunnen we zonder eigen `android/`-project presenteren.

---

## Hoe versturen we een melding? (telefoon → PC)

1. Gebruiker vult titel, categorie, locatie, beschrijving in en maakt/kiest een **foto** (`nieuw.tsx`).
2. Validatie: titel + beschrijving + foto verplicht.
3. App bouwt een `Melding`-object (id, status `nieuw`, `fotoBase64`, …).
4. **`syncMelding`** (`services/api.ts`) doet een HTTP **POST** naar  
   `http://<pc-ip>:3001/api/meldingen`  
   (zelfde wifi; basis-URL uit `config.ts`).
5. PC-server (`server/index.js`) schrijft de melding naar `server/data/meldingen.json`.
6. Dashboard op `http://localhost:3001` toont de melding live.
7. Bij succes: lokaal opslaan + **`successFeedback`** (trillen) + bevestigingsscherm.

**Status wijzigen:** op de telefoon (detailscherm) of op het PC-dashboard — beide doen een HTTP **PATCH** naar  
`/api/meldingen/:id` met de nieuwe status (`nieuw` / `in behandeling` / `afgerond`).

**Offline:** als de PC-API niet bereikbaar is → foutmelding + optie “Lokaal opslaan” (AsyncStorage), zonder sync.

```
Telefoon (Expo)  --POST/PATCH JSON-->  PC Express :3001  -->  meldingen.json
                                              |
                                              v
                                       Dashboard (browser, status wijzigen)
```

---

## Hoe sturen we een notificatie naar de telefoon? (PC → telefoon)

We gebruiken **geen** Firebase / Apple Push / Google FCM.  
In de inventarisatie staat push via externe server bewust **buiten scope**.  
Echte remote push werkt in Expo Go op Android ook niet (SDK 53+).

### Wat we wél doen: wachtrij + polling + lokale statusbalk-notificatie

1. Op het **dashboard** klik je **“Stuur notificatie”** (of maak je een PC-melding met “naar telefoon”).
2. Browser doet **POST** `/api/notify` (of POST `/api/meldingen` met `notifyPhone: true`).
3. Server zet een bericht in `pending-notifications.json`.
4. De app (`usePcNotifications` in `_layout.tsx`) **pollt elke 4 seconden**  
   **GET** `/api/notify/pending` zolang de app **open/actief** is.
5. Server geeft de wachtrij terug en **leegt** die.
6. App plant een **lokale systeemnotificatie** (`expo-notifications` → statusbalk / notification tray) + **trilt**.

```
Dashboard  --POST /api/notify-->  pending-notifications.json
                                         ^
Telefoon   --GET /api/notify/pending-----+  (elke 4s, app open)
           --> lokale notificatie (statusbalk) + vibratie
```

### Waarom deze manier, niet “echte” push?

| Aanpak | Voordeel | Nadeel / waarom niet |
|--------|----------|----------------------|
| **Polling + lokale notificatie (gekozen)** | Zelfde look als push in de statusbalk; werkt in Expo Go; geen cloud | Alleen als de app open is (pollt) |
| **FCM / APNs (echte push)** | Werkt op achtergrond | Cloud, keys, buiten scope; niet in Expo Go Android |

**Presentatietip:** houd de Expo-app open → klik op het dashboard “Stuur notificatie” → binnen ~4 seconden trillen + melding in de statusbalk. Sta notificaties toe als Android daarom vraagt.

---

## Hardware die we aantonen

| Hardware | Module / API | Wanneer |
|----------|--------------|---------|
| Camera / galerij | `expo-image-picker` | Nieuwe melding |
| Internet | `fetch` naar PC-API | Ophalen + versturen meldingen + notify-poll |
| Trillen | `expo-haptics` + `Vibration` | Na versturen, statuswijziging, PC-notificatie |
| Notificatie (statusbalk) | `expo-notifications` (lokaal) | Bericht vanaf PC-dashboard na poll |

---

## Projectstructuur

```
app/                 # Expo React Native (TypeScript)
  app/               # Schermen (Expo Router)
  services/          # api, config, storage, feedback, photos
  hooks/             # usePcNotifications (poll PC → telefoon)
server/              # Express API + dashboard (JavaScript)
  data/              # meldingen.json, pending-notifications.json
docs/                # Opdrachten 1–5
```

## Akkoord opdrachtgever

| Onderdeel | Besluit | Datum | Handtekening |
|-----------|---------|-------|--------------|
| Expo + React Native + TypeScript | ☐ Akkoord | …… | …… |
| PC-API + polling i.p.v. cloud-push | ☐ Akkoord | …… | …… |
