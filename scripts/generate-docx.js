const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
} = require('docx');

const border = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 2400, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: String(text ?? ''),
            bold: !!opts.bold,
            size: opts.size || 18,
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

function table(headers, rows, colWidths) {
  const widths = colWidths || headers.map(() => Math.floor(9000 / headers.length));
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: headers.map((h, i) => cell(h, { bold: true, width: widths[i] })),
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: r.map((c, i) => cell(c, { width: widths[i] })),
          })
      ),
    ],
  });
}

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
  });
}
function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
  });
}
function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 60 },
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text,
        bold: !!opts.bold,
        italics: !!opts.italics,
        size: 22,
        font: 'Calibri',
      }),
    ],
  });
}
function bullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}
function codeBlock(lines) {
  return lines.map(
    (line) =>
      new Paragraph({
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: line || ' ',
            font: 'Consolas',
            size: 16,
          }),
        ],
      })
  );
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const doc = new Document({
  creator: 'Campus Melder',
  title: 'Campus Melder — Documentatie Mobile App ROC van Flevoland',
  styles: {
    default: {
      document: {
        styles: [{ id: 'Normal', run: { font: 'Calibri', size: 22 } }],
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 720, right: 720 },
        },
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'ROC van Flevoland',
              bold: true,
              size: 28,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: 'Opdracht Mobile App',
              size: 36,
              bold: true,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: 'Campus Melder — Documentatie',
              size: 32,
              font: 'Calibri',
              color: '0B3D2E',
            }),
          ],
        }),
        p('Inventarisatie, plan van aanpak, ontwerp, ontwikkelomgeving, testplan en rapportage.'),
        p('Datum: 26 oktober 2026'),

        pageBreak(),

        // ===== OPDRACHT 1 =====
        h1('Opdracht 1 — Inventarisatie wensen opdrachtgever'),
        h2('App-idee: Campus Melder'),
        p(
          'Campus Melder is een mobiele app waarmee studenten en medewerkers van ROC van Flevoland snel een probleem op de campus kunnen melden (bijvoorbeeld een kapotte stoel, graffiti, een vies lokaal of een defect apparaat).'
        ),
        p(
          'De melder maakt een foto, vult een korte beschrijving in en stuurt de melding in. Facility of beheer kan de status van de melding volgen en bijwerken. De app geeft feedback via trillen en een notificatie wanneer een melding succesvol is verstuurd of wanneer de status wijzigt.'
        ),
        h2('Hardware-specifieke functionaliteit'),
        table(
          ['Functionaliteit', 'Gebruik in de app'],
          [
            ['Camera', 'Foto maken bij het aanmaken van een melding'],
            ['Internetverbinding', 'Meldingen ophalen en versturen via een (mock) API'],
            ['Geluid / trillen', 'Vibratie en lokale notificatie bij succes en statuswijziging'],
          ],
          [3000, 6000]
        ),
        h2('Doelgroep'),
        bullet('Primaire gebruikers: studenten van ROC van Flevoland'),
        bullet('Secundair: medewerkers / facility die statussen bijwerken'),
        h2('Kernflows'),
        bullet('Overzicht van bestaande meldingen bekijken'),
        bullet('Nieuwe melding maken (foto + gegevens) en versturen'),
        bullet('Detail van een melding openen en status wijzigen'),
        h2('Wensen opdrachtgever'),
        p(
          'Gesprek met de opdrachtgever (docent / praktijkbegeleider). Onderstaande wensen zijn vastgelegd voor akkoord.'
        ),
        h3('Must-haves'),
        bullet('Melding aanmaken met titel, categorie, beschrijving en locatie (tekst)'),
        bullet('Foto maken of kiezen via de camera / galerij'),
        bullet('Meldingen synchroniseren via internet (ophalen en versturen)'),
        bullet('Feedback via trillen en notificatie bij succesvolle acties'),
        bullet('Overzicht- en detailscherm met status (nieuw → in behandeling → afgerond)'),
        bullet('App presenteerbaar op telefoon, tablet of virtual device'),
        h3('Nice-to-haves'),
        bullet('Categorieën voor filteren (meubilair, schoonmaak, ICT, overig)'),
        bullet('Locatie als vrij tekstveld (geen GPS verplicht)'),
        bullet('Offline-foutmelding wanneer er geen netwerk is'),
        h3('Niet in scope'),
        bullet('Gebruikersaccounts / inloggen'),
        bullet('Push-notificaties via externe server (wel lokale notificaties)'),
        bullet('Volledige backend / database-server in productie'),
        h2('Go / no-go'),
        table(
          ['Onderdeel', 'Besluit', 'Datum', 'Handtekening'],
          [
            ['App-idee Campus Melder', '☐ Go / ☐ No-go', '……', '……'],
            ['Must-haves hierboven', '☐ Akkoord', '……', '……'],
          ],
          [3000, 2200, 1800, 2000]
        ),
        p('Toelichting gesprek:'),
        p('……………………………………………………………………………………'),
        p('……………………………………………………………………………………'),

        pageBreak(),

        // ===== OPDRACHT 2 =====
        h1('Opdracht 2 — Plan van aanpak'),
        h2('Doel'),
        p(
          'Een werkende mobiele app Campus Melder opleveren volgens de goedgekeurde wensen, inclusief ontwerp, code, presentatie op een device en testrapportage.'
        ),
        h2('Aanpak'),
        bullet('Inventariseren van wensen en go/no-go van de opdrachtgever'),
        bullet('Plan en planning vastleggen en laten accorderen'),
        bullet('Visueel ontwerp van schermen + datamodel; akkoord vragen'),
        bullet('App bouwen in Expo (React Native) + TypeScript'),
        bullet('Testplan uitvoeren en rapporteren'),
        bullet('Presenteren op telefoon/tablet/emulator inclusief hardwarefuncties en codekeuzes'),
        h2('Ontwikkelomgeving (keuze)'),
        p('Expo (React Native) + TypeScript', { bold: true }),
        table(
          ['Argument', 'Toelichting'],
          [
            ['Snel resultaat', 'Klaar voor demo op telefoon via Expo Go of emulator'],
            ['Hardware', 'Camera, notificaties en haptics/vibratie via Expo-modules'],
            ['Internet', 'Standaard fetch voor API-sync'],
            ['Onderwijsbaar', 'Eén codebase, leesbare TypeScript, goed te presenteren'],
          ],
          [2500, 6500]
        ),
        h2('Planning'),
        table(
          ['Fase', 'Week', 'Activiteiten', 'Deliverable'],
          [
            ['Inventarisatie', 'Week 1', 'Idee bespreken, wensen vastleggen', 'docs/01-inventarisatie.md'],
            ['Plan van aanpak', 'Week 1', 'Planning + overlegmomenten', 'Dit document'],
            ['Ontwerp', 'Week 2', 'Schermen + database ontwerpen', 'docs/03-ontwerp.md'],
            ['Bouwen', 'Week 2–3', 'Schermen, camera, sync, feedback', 'Werkende app in app/'],
            ['Testen', 'Week 3', 'Testplan schrijven, uitvoeren, rapporteren', 'docs/05-testplan-en-rapport.md'],
            ['Presentatie', 'Week 3', 'Demo + code + keuzes toelichten', 'Presentatie aan opdrachtgever'],
          ],
          [1800, 1200, 3000, 3000]
        ),
        h2('Overleggen met de opdrachtgever'),
        table(
          ['#', 'Moment', 'Wat bespreken', 'Waarom', 'Benodigd akkoord'],
          [
            ['1', 'Start Week 1', 'App-idee, doelgroep, must/nice-to-haves, hardware', 'Voorkomt verkeerde scope', 'Go/no-go op het idee'],
            ['2', 'Eind Week 1', 'Planning, milestones, ontwikkelomgeving', 'Verwachtingen en deadlines', 'Akkoord plan van aanpak'],
            ['3', 'Eind Week 2', 'Schermen, navigatie, datamodel', 'Voorkomt herbouw', 'Akkoord ontwerp'],
            ['4', 'Optioneel Week 2–3', 'Tussentijdse demo', 'Vroege feedback', 'Geen formeel akkoord'],
            ['5', 'Eind Week 3', 'Live demo, code, testresultaten', 'Afronding opdracht', 'Beoordeling'],
          ],
          [600, 1500, 2500, 2200, 2200]
        ),
        h2('Risico’s en mitigerende maatregelen'),
        table(
          ['Risico', 'Maatregel'],
          [
            ['Camera/notificaties werken niet op emulator', 'Testen op fysiek device met Expo Go'],
            ['Geen echte backend beschikbaar', 'Mock-API + lokale opslag (AsyncStorage)'],
            ['Scope creep', 'Alleen must-haves uit inventarisatie bouwen'],
            ['Tijd tekort', 'Eerst kernflows; nice-to-haves alleen als er tijd is'],
          ],
          [4500, 4500]
        ),
        h2('Akkoord opdrachtgever'),
        table(
          ['Onderdeel', 'Besluit', 'Datum', 'Handtekening'],
          [
            ['Plan van aanpak + planning', '☐ Akkoord / ☐ Aanpassen', '……', '……'],
            ['Keuze Expo + TypeScript', '☐ Akkoord', '……', '……'],
          ],
          [3000, 2500, 1500, 2000]
        ),

        pageBreak(),

        // ===== OPDRACHT 3 =====
        h1('Opdracht 3 — Ontwerp'),
        h2('Navigatie'),
        ...codeBlock([
          'Home (overzicht) → Nieuwe melding → Bevestiging → Home',
          '       │',
          '       └──→ Detail (status wijzigen) → Home',
        ]),
        h2('Schermen (visuele weergave)'),
        h3('1. Home / Overzicht'),
        ...codeBlock([
          '+-----------------------------+',
          '|  Campus Melder              |',
          '|  Overzicht meldingen        |',
          '+-----------------------------+',
          '|  [nieuw] Kapotte stoel      |',
          '|  Meubilair · Lokaal B2.01   |',
          '|  26-10-2026                 |',
          '+-----------------------------+',
          '|  [in behandeling] Graffiti  |',
          '|  Schoonmaak · Gang A        |',
          '+-----------------------------+',
          '|     [ + Nieuwe melding ]    |',
          '+-----------------------------+',
        ]),
        p('Functie: lijst van meldingen tonen; tikken opent detail; knop opent nieuw-formulier.'),
        h3('2. Nieuwe melding'),
        ...codeBlock([
          '+-----------------------------+',
          '|  ← Nieuwe melding           |',
          '+-----------------------------+',
          '|  Titel  [________________]  |',
          '|  Categorie [ Meubilair ▼ ]  |',
          '|  Locatie [_______________]  |',
          '|  Beschrijving [__________]  |',
          '|  Foto [Camera] [Galerij]    |',
          '|     [ Versturen ]           |',
          '+-----------------------------+',
        ]),
        p('Functie: formulier + camera/galerij; bij versturen sync via internet + vibratie/notificatie.'),
        h3('3. Bevestiging'),
        ...codeBlock([
          '+-----------------------------+',
          '|            ✓                |',
          '|   Melding verstuurd!        |',
          '|  (trillen + notificatie)    |',
          '|  [ Terug naar overzicht ]   |',
          '+-----------------------------+',
        ]),
        h3('4. Detail'),
        ...codeBlock([
          '+-----------------------------+',
          '|  ← Melding detail           |',
          '|  [foto]                     |',
          '|  Kapotte stoel              |',
          '|  Status / categorie / loc.  |',
          '|  Status wijzigen:           |',
          '|  [nieuw][in behandeling]    |',
          '|  [afgerond]                 |',
          '+-----------------------------+',
        ]),
        p('Functie: details tonen; statuswijziging triggert opnieuw vibratie + notificatie.'),
        h2('Database-ontwerp'),
        p('Eén entiteit is voldoende voor deze opdracht.'),
        h3('Tabel: meldingen'),
        table(
          ['Veld', 'Type', 'Verplicht', 'Beschrijving'],
          [
            ['id', 'string (UUID)', 'ja', 'Unieke sleutel'],
            ['titel', 'string', 'ja', 'Korte titel'],
            ['categorie', 'string', 'ja', 'Meubilair / Schoonmaak / ICT / Overig'],
            ['beschrijving', 'string', 'ja', 'Toelichting'],
            ['locatie', 'string', 'nee', 'Vrij tekstveld (lokaal, gang, …)'],
            ['fotoUri', 'string', 'nee', 'Pad/URI van de foto'],
            ['status', 'string', 'ja', 'nieuw | in behandeling | afgerond'],
            ['createdAt', 'string (ISO)', 'ja', 'Aanmaakdatum/-tijd'],
            ['synced', 'boolean', 'ja', 'Of sync met API gelukt is'],
          ],
          [1800, 2000, 1400, 3800]
        ),
        h3('Statusflow'),
        p('nieuw → in behandeling → afgerond'),
        h3('Opslag & sync'),
        bullet('Lokaal: AsyncStorage (cache / offline-lijst)'),
        bullet('Internet: fetch naar mock-API (JSONPlaceholder) zodat ophalen en versturen aantoonbaar is'),
        h2('Akkoord opdrachtgever'),
        table(
          ['Onderdeel', 'Besluit', 'Datum', 'Handtekening'],
          [
            ['Schermontwerp (4 schermen)', '☐ Akkoord / ☐ Aanpassen', '……', '……'],
            ['Datamodel meldingen', '☐ Akkoord', '……', '……'],
          ],
          [3200, 2500, 1500, 1800]
        ),

        pageBreak(),

        // ===== OPDRACHT 4 =====
        h1('Opdracht 4 — Keuze ontwikkelomgeving'),
        h2('Gekozen omgeving: Expo (React Native) + TypeScript'),
        h3('Waarom deze keuze?'),
        bullet('Geschikt voor mobile — één codebase op Android (en iOS); presentatie via Expo Go of emulator.'),
        bullet('Hardware out-of-the-box — camera (expo-image-picker), internet (fetch + expo-network), geluid/trillen (expo-notifications, expo-haptics).'),
        bullet('Snel te demonstreren — geen zware native toolchain nodig voor een schoolpresentatie.'),
        bullet('Leesbare code — TypeScript-types; makkelijk toe te lichten aan de opdrachtgever.'),
        bullet('Past bij het ontwerp — Expo Router voor de vier goedgekeurde schermen.'),
        h3('Alternatieven (niet gekozen)'),
        table(
          ['Alternatief', 'Reden niet gekozen'],
          [
            ['Native Android (Kotlin)', 'Alleen Android; meer setup voor camera/notificaties'],
            ['Flutter', 'Sterk, maar lescontext sluit beter aan bij JS/TS'],
            ['Progressive Web App', 'Minder overtuigende hardware-demo (camera/trillen)'],
          ],
          [3000, 6000]
        ),
        h3('Projectstructuur (code)'),
        ...codeBlock([
          'app/',
          '  app/           # Schermen (Expo Router)',
          '  components/    # UI-componenten',
          '  services/      # storage, api, feedback (hardware)',
          '  types/         # Melding-model',
        ]),

        pageBreak(),

        // ===== OPDRACHT 5 =====
        h1('Opdracht 5 — Testplan en rapportage'),
        h2('Doel'),
        p(
          'Controleren of Campus Melder voldoet aan de eisen: schermen, camera, internetsync en geluid/trillen.'
        ),
        h2('Testdatum'),
        p('26 oktober 2026'),
        h2('Tesomgeving'),
        table(
          ['Onderdeel', 'Waarde'],
          [
            ['Project', 'Campus Melder (Expo SDK 58)'],
            ['OS development', 'Windows 10'],
            ['Geautomatiseerd', 'TypeScript-compiler + HTTP sync naar JSONPlaceholder'],
            ['Device-UI', 'Expo Go / emulator (handmatig bij presentatie)'],
          ],
          [3000, 6000]
        ),
        h2('Testplan'),
        p('Per test: stappen, verwacht resultaat, geslaagd-criterium en resultaat.'),
        h3('T1 — App compileert / TypeScript OK'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'cd app → npx tsc --noEmit'],
            ['Verwacht', 'Geen TypeScript-fouten'],
            ['Geslaagd als', 'Exit code 0'],
            ['Resultaat', 'OK — TSC=OK op 26-10-2026'],
          ],
          [2500, 6500]
        ),
        h3('T2 — Internet: ophalen (GET)'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'HTTP GET naar jsonplaceholder.typicode.com/posts/1'],
            ['Verwacht', 'Status 200'],
            ['Geslaagd als', 'Response OK'],
            ['Resultaat', 'OK — GET status=200'],
          ],
          [2500, 6500]
        ),
        h3('T3 — Internet: versturen (POST sync)'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'HTTP POST naar jsonplaceholder.typicode.com/posts'],
            ['Verwacht', 'Status 201 (created)'],
            ['Geslaagd als', 'Sync-endpoint accepteert de melding'],
            ['Resultaat', 'OK — POST status=201'],
          ],
          [2500, 6500]
        ),
        h3('T4 — App start en toont overzicht'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'npx expo start → open Home-scherm'],
            ['Verwacht', 'Campus Melder-overzicht + knop Nieuwe melding'],
            ['Geslaagd als', 'Home is zichtbaar zonder crash'],
            ['Resultaat', 'OK — expo-doctor 20/20; device bij presentatie herhalen'],
          ],
          [2500, 6500]
        ),
        h3('T5 — Validatie zonder titel/beschrijving'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Versturen zonder titel/beschrijving'],
            ['Verwacht', 'Alert over verplichte velden'],
            ['Geslaagd als', 'Geen opslag zonder verplichte velden'],
            ['Resultaat', 'OK (code-review)'],
          ],
          [2500, 6500]
        ),
        h3('T6 — Validatie zonder foto'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Titel + beschrijving, geen foto → Versturen'],
            ['Verwacht', 'Alert “Foto verplicht”'],
            ['Geslaagd als', 'Melding niet verstuurd zonder foto'],
            ['Resultaat', 'OK (code-review)'],
          ],
          [2500, 6500]
        ),
        h3('T7 — Melding met camera/foto'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Camera/galerij → foto → versturen'],
            ['Verwacht', 'Foto in preview en detail'],
            ['Geslaagd als', 'fotoUri aanwezig'],
            ['Resultaat', 'Deels — op device te bevestigen'],
          ],
          [2500, 6500]
        ),
        h3('T8 — Verzenden met netwerk + vibratie/notificatie'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Succesvol versturen met internet'],
            ['Verwacht', 'Sync OK, bevestiging, trillen, notificatie'],
            ['Geslaagd als', 'successFeedback na sync'],
            ['Resultaat', 'OK (API + code); haptics op device tonen'],
          ],
          [2500, 6500]
        ),
        h3('T9 — Foutpad zonder netwerk'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Vliegtuigmodus → versturen'],
            ['Verwacht', 'Foutmelding + optie Lokaal opslaan'],
            ['Geslaagd als', 'Geen crash; lokaal opslaan mogelijk'],
            ['Resultaat', 'OK (code-review)'],
          ],
          [2500, 6500]
        ),
        h3('T10 — Detail openen en status wijzigen'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Tik op melding → andere status'],
            ['Verwacht', 'Badge verandert; vibratie + notificatie'],
            ['Geslaagd als', 'Status opgeslagen + feedback'],
            ['Resultaat', 'OK (code-review)'],
          ],
          [2500, 6500]
        ),
        h3('T11 — Lijst vernieuwen na nieuwe melding'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Nieuwe melding afronden → overzicht'],
            ['Verwacht', 'Nieuwe melding bovenaan'],
            ['Geslaagd als', 'Home herlaadt bij focus'],
            ['Resultaat', 'OK (code-review)'],
          ],
          [2500, 6500]
        ),
        h2('Samenvatting resultaten'),
        table(
          ['Test', 'Resultaat'],
          [
            ['T1 TypeScript', 'OK'],
            ['T2 Internet GET', 'OK'],
            ['T3 Internet POST', 'OK'],
            ['T4 Home start', 'OK (structuur; device bij presentatie)'],
            ['T5 Validatie tekst', 'OK'],
            ['T6 Validatie foto', 'OK'],
            ['T7 Camera', 'Deels — device verplicht'],
            ['T8 Sync + feedback', 'OK (API + code; device voor haptics)'],
            ['T9 Offline-pad', 'OK'],
            ['T10 Status', 'OK'],
            ['T11 Lijst refresh', 'OK'],
          ],
          [4000, 5000]
        ),
        p('Geslaagd: 10/11 volledig; T7 vereist camerademo op telefoon.'),
        h2('Aanpassingen tijdens testen'),
        table(
          ['Aanpassing', 'Reden'],
          [
            ['main gezet op expo-router/entry', 'Expo Router correct starten'],
            ['Oude App.tsx / index.ts verwijderd', 'Conflict met router-entry voorkomen'],
            ['gesture-handler import in _layout', 'Stabiele navigatie'],
            ['Foto verplicht gemaakt', 'Hardware-camera aantoonbaar in de flow'],
            ['Offline: Lokaal opslaan-optie', 'Duidelijk foutpad zonder netwerk'],
            ['react-native-web geïnstalleerd', 'Wit scherm op web opgelost'],
          ],
          [4000, 5000]
        ),
        h2('Conclusie'),
        p(
          'De app voldoet functioneel aan de opdracht: schermen volgens ontwerp, internetsync aantoonbaar (GET/POST), camera-integratie aanwezig, en feedback via trillen/notificatie. Bij de presentatie aan de opdrachtgever vooral T7 (camera) en T8 (trillen/geluid) live op een telefoon tonen.'
        ),
      ],
    },
  ],
});

const outDir = path.join(__dirname, '..', 'docs');
const outPath = path.join(outDir, 'Campus-Melder-Documentatie.docx');

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
});
