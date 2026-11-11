# Campus Melder — ROC Mobile App

Opdracht Mobile App (ROC van Flevoland): inventarisatie, plan, ontwerp, Expo-app en testrapportage.

## Documentatie

| Bestand | Opdracht |
|---------|----------|
| [docs/01-inventarisatie.md](docs/01-inventarisatie.md) | 1 — Wensen & go/no-go |
| [docs/02-plan-van-aanpak.md](docs/02-plan-van-aanpak.md) | 2 — Plan & planning |
| [docs/03-ontwerp.md](docs/03-ontwerp.md) | 3 — Schermen & database |
| [docs/05-testplan-en-rapport.md](docs/05-testplan-en-rapport.md) | 5 — Testplan & resultaten |
| [docs/04-ontwikkelomgeving.md](docs/04-ontwikkelomgeving.md) | 4 — Keuze ontwikkelomgeving (taal, native, melding, notificatie) |
| [docs/Campus-Melder-Documentatie.docx](docs/Campus-Melder-Documentatie.docx) | Zelfde inhoud als Word-document |

## Starten (2 processen)

**1. PC API + dashboard** (gedeelde JSON):

```bash
cd server
npm install
npm start
```

Open dashboard: http://localhost:3001

**2. Expo-app**

```bash
cd app
npm install
npx expo start --lan
```

Open met **Expo Go** op je telefoon (`exp://192.168.68.101:8081`).

## Sync telefoon ↔ PC

- Meldingen worden opgeslagen in `server/data/meldingen.json`
- Telefoon praat met `http://<pc-ip>:3001`
- Dashboard op localhost ververst automatisch
- Status van een melding kun je wijzigen op de telefoon én op het PC-dashboard (`nieuw` → `in behandeling` → `afgerond`)
- Knop **Stuur naar telefoon** zet een bericht in de wachtrij; de app pollt en toont een lokale notificatie in de statusbalk + trillen

## Hardware in de app

- **Camera** — foto bij nieuwe melding (`expo-image-picker`)
- **Internet** — sync met lokale PC-API (JSON)
- **Trillen** — haptics/Vibration bij succes en PC-berichten

## Presentatie: keuzes & notificatie

Uitleg taal, native vs alternatieven, hoe een melding POST’ed wordt, en hoe PC→telefoon-notificatie werkt (polling, geen FCM):  
[docs/04-ontwikkelomgeving.md](docs/04-ontwikkelomgeving.md)
