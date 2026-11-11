# Opdracht 1 — Inventarisatie wensen opdrachtgever

## App-idee: Campus Melder

**Campus Melder** is een mobiele app waarmee studenten en medewerkers van ROC van Flevoland snel een probleem op de campus kunnen melden (bijvoorbeeld een kapotte stoel, graffiti, een vies lokaal of een defect apparaat).

De melder maakt een foto, vult een korte beschrijving in en stuurt de melding in. Facility of beheer kan de status van de melding volgen en bijwerken. De app geeft feedback via trillen en een notificatie wanneer een melding succesvol is verstuurd of wanneer de status wijzigt.

## Hardware-specifieke functionaliteit

| Functionaliteit | Gebruik in de app |
|-----------------|-------------------|
| Camera | Foto maken bij het aanmaken van een melding |
| Internetverbinding | Meldingen ophalen en versturen via een (mock) API |
| Geluid / trillen | Vibratie en lokale notificatie bij succes en statuswijziging |

## Doelgroep

- Primaire gebruikers: studenten van ROC van Flevoland
- Secundair: medewerkers / facility die statussen bijwerken

## Kernflows

1. Overzicht van bestaande meldingen bekijken
2. Nieuwe melding maken (foto + gegevens) en versturen
3. Detail van een melding openen en status wijzigen

## Wensen opdrachtgever (inventarisatie)

Gesprek met de opdrachtgever (docent / praktijkbegeleider). Onderstaande wensen zijn vastgelegd voor akkoord.

### Must-haves

- [ ] Melding aanmaken met titel, categorie, beschrijving en locatie (tekst)
- [ ] Foto maken of kiezen via de camera / galerij
- [ ] Meldingen synchroniseren via internet (ophalen en versturen)
- [ ] Feedback via trillen en notificatie bij succesvolle acties
- [ ] Overzicht- en detailscherm met status (`nieuw` → `in behandeling` → `afgerond`)
- [ ] App presenteerbaar op telefoon, tablet of virtual device

### Nice-to-haves

- [ ] Categorieën voor filteren (bijv. meubilair, schoonmaak, ICT, overig)
- [ ] Locatie als vrij tekstveld (geen GPS verplicht)
- [ ] Offline-foutmelding wanneer er geen netwerk is

### Niet in scope (bewust)

- Gebruikersaccounts / inloggen
- Push-notificaties via externe server (wel lokale notificaties)
- Volledige backend / database-server in productie

## Go / no-go

| Onderdeel | Besluit | Datum | Handtekening opdrachtgever |
|-----------|---------|-------|----------------------------|
| App-idee Campus Melder | ☐ Go / ☐ No-go | …… | …… |
| Must-haves hierboven | ☐ Akkoord | …… | …… |

**Toelichting gesprek:**  
……………………………………………………………………………………  
……………………………………………………………………………………  
