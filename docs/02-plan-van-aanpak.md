# Opdracht 2 — Plan van aanpak

## Doel

Een werkende mobiele app **Campus Melder** opleveren volgens de goedgekeurde wensen, inclusief ontwerp, code, presentatie op een device en testrapportage.

## Aanpak

1. Inventariseren van wensen en go/no-go van de opdrachtgever
2. Plan en planning vastleggen en laten accorderen
3. Visueel ontwerp van schermen + datamodel; akkoord vragen
4. App bouwen in Expo (React Native) + TypeScript
5. Testplan uitvoeren en rapporteren
6. Presenteren op telefoon/tablet/emulator inclusief hardwarefuncties en codekeuzes

## Ontwikkelomgeving (keuze)

**Expo (React Native) + TypeScript**

| Argument | Toelichting |
|----------|-------------|
| Snel resultaat | Klaar voor demo op telefoon via Expo Go of emulator |
| Hardware | Camera, notificaties en haptics/vibratie via Expo-modules |
| Internet | Standaard `fetch` voor API-sync |
| Onderwijsbaar | Eén codebase, leesbare TypeScript, goed te presenteren |

## Planning

| Fase | Week | Activiteiten | Deliverable |
|------|------|--------------|-------------|
| Inventarisatie | Week 1 | Idee bespreken, wensen vastleggen | `docs/01-inventarisatie.md` |
| Plan van aanpak | Week 1 | Planning + overlegmomenten | Dit document |
| Ontwerp | Week 2 | Schermen + database ontwerpen | `docs/03-ontwerp.md` |
| Bouwen | Week 2–3 | Schermen, camera, sync, feedback | Werkende app in `app/` |
| Testen | Week 3 | Testplan schrijven, uitvoeren, rapporteren | `docs/05-testplan-en-rapport.md` |
| Presentatie | Week 3 | Demo + code + keuzes toelichten | Presentatie aan opdrachtgever |

## Overleggen met de opdrachtgever

| # | Moment | Wat bespreken | Waarom | Benodigd akkoord |
|---|--------|---------------|--------|------------------|
| 1 | Start Week 1 | App-idee, doelgroep, must/nice-to-haves, hardware | Voorkomt verkeerde scope | **Go/no-go** op het idee |
| 2 | Eind Week 1 | Planning, milestones, ontwikkelomgeving | Zodat verwachtingen en deadlines kloppen | **Akkoord plan van aanpak** |
| 3 | Eind Week 2 (voor code) | Schermen, navigatie, datamodel | Voorkomt herbouw door verkeerd ontwerp | **Akkoord ontwerp** |
| 4 | Optioneel midden Week 2–3 | Tussentijdse demo van werkende schermen | Vroege feedback | Geen formeel akkoord nodig |
| 5 | Eind Week 3 | Live demo (device), code, testresultaten, keuzes | Afronding opdracht | Beoordeling / afronding |

## Risico’s en mitigerende maatregelen

| Risico | Maatregel |
|--------|-----------|
| Camera/notificaties werken niet op emulator | Testen op fysiek device met Expo Go |
| Geen echte backend beschikbaar | Mock-API + lokale opslag (AsyncStorage) |
| Scope creep | Alleen must-haves uit inventarisatie bouwen |
| Tijd tekort | Eerst kernflows; nice-to-haves alleen als er tijd is |

## Akkoord opdrachtgever

| Onderdeel | Besluit | Datum | Handtekening |
|-----------|---------|-------|--------------|
| Plan van aanpak + planning | ☐ Akkoord / ☐ Aanpassen | …… | …… |
| Keuze Expo + TypeScript | ☐ Akkoord | …… | …… |
