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
function numbered(text, n) {
  return new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text: `${n}. ${text}`, size: 22, font: 'Calibri' })],
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
        p(
          'Inventarisatie, plan van aanpak, ontwerp, ontwikkelomgeving (taal/native/notificatie), testplan en rapportage.'
        ),
        p('Datum: 11 november 2026'),

        pageBreak(),

        // ===== OPDRACHT 1 =====
        h1('Opdracht 1 — Inventarisatie wensen opdrachtgever'),
        h2('App-idee: Campus Melder'),
        p(
          'Campus Melder is een mobiele app waarmee studenten en medewerkers van ROC van Flevoland snel een probleem op de campus kunnen melden (bijvoorbeeld een kapotte stoel, graffiti, een vies lokaal of een defect apparaat).'
        ),
        p(
          'De melder maakt een foto, vult een korte beschrijving in en stuurt de melding in. Facility of beheer kan de status van de melding volgen en bijwerken — op de telefoon én op het PC-dashboard. De app geeft feedback via trillen en een notificatie wanneer een melding succesvol is verstuurd of wanneer de status wijzigt.'
        ),
        h2('Hardware-specifieke functionaliteit'),
        table(
          ['Functionaliteit', 'Gebruik in de app'],
          [
            ['Camera', 'Foto maken bij het aanmaken van een melding'],
            [
              'Internetverbinding',
              'Meldingen ophalen en versturen via de lokale PC-API (wifi)',
            ],
            [
              'Geluid / trillen',
              'Vibratie + lokale statusbalk-notificatie bij succes, statuswijziging en PC→telefoon',
            ],
          ],
          [3000, 6000]
        ),
        h2('Doelgroep'),
        bullet('Primaire gebruikers: studenten van ROC van Flevoland'),
        bullet('Secundair: medewerkers / facility die statussen bijwerken'),
        h2('Kernflows'),
        bullet('Overzicht van bestaande meldingen bekijken'),
        bullet('Nieuwe melding maken (foto + gegevens) en versturen'),
        bullet('Detail van een melding openen en status wijzigen (op telefoon én op het PC-dashboard)'),
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
        bullet(
          'Push-notificaties via externe server (Firebase/FCM) — wel lokale statusbalk-notificatie + trillen via polling'
        ),
        bullet(
          'Volledige productie-backend / database-server (we gebruiken wel een eenvoudige PC JSON-API)'
        ),
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
        bullet(
          'Presenteren op telefoon/tablet/emulator inclusief hardwarefuncties en codekeuzes'
        ),
        h2('Ontwikkelomgeving (keuze)'),
        p('Expo (React Native) + TypeScript', { bold: true }),
        table(
          ['Argument', 'Toelichting'],
          [
            ['Snel resultaat', 'Klaar voor demo op telefoon via Expo Go of emulator'],
            [
              'Hardware',
              'Camera (expo-image-picker), trillen (expo-haptics) via Expo-modules',
            ],
            ['Internet', 'fetch naar lokale PC-API (Express + JSON)'],
            ['Notificatie PC→telefoon', 'Wachtrij + polling (geen cloud-push)'],
            ['Onderwijsbaar', 'Eén codebase, leesbare TypeScript, goed te presenteren'],
          ],
          [2800, 6200]
        ),
        h2('Planning'),
        table(
          ['Fase', 'Week', 'Activiteiten', 'Deliverable'],
          [
            ['Inventarisatie', 'Week 1', 'Idee bespreken, wensen vastleggen', 'docs/01-inventarisatie.md'],
            ['Plan van aanpak', 'Week 1', 'Planning + overlegmomenten', 'Dit document'],
            ['Ontwerp', 'Week 2', 'Schermen + database ontwerpen', 'docs/03-ontwerp.md'],
            ['Bouwen', 'Week 2–3', 'Schermen, camera, sync, feedback', 'Werkende app in app/'],
            [
              'Testen',
              'Week 3',
              'Testplan schrijven, uitvoeren, rapporteren',
              'docs/05-testplan-en-rapport.md',
            ],
            [
              'Presentatie',
              'Week 3',
              'Demo + code + keuzes toelichten',
              'Presentatie aan opdrachtgever',
            ],
          ],
          [1800, 1200, 3000, 3000]
        ),
        h2('Overleggen met de opdrachtgever'),
        table(
          ['#', 'Moment', 'Wat bespreken', 'Waarom', 'Benodigd akkoord'],
          [
            [
              '1',
              'Start Week 1',
              'App-idee, doelgroep, must/nice-to-haves, hardware',
              'Voorkomt verkeerde scope',
              'Go/no-go op het idee',
            ],
            [
              '2',
              'Eind Week 1',
              'Planning, milestones, ontwikkelomgeving',
              'Verwachtingen en deadlines',
              'Akkoord plan van aanpak',
            ],
            [
              '3',
              'Eind Week 2',
              'Schermen, navigatie, datamodel',
              'Voorkomt herbouw',
              'Akkoord ontwerp',
            ],
            [
              '4',
              'Optioneel Week 2–3',
              'Tussentijdse demo',
              'Vroege feedback',
              'Geen formeel akkoord',
            ],
            [
              '5',
              'Eind Week 3',
              'Live demo, code, testresultaten, keuzes',
              'Afronding opdracht',
              'Beoordeling',
            ],
          ],
          [600, 1500, 2500, 2200, 2200]
        ),
        h2('Risico’s en mitigerende maatregelen'),
        table(
          ['Risico', 'Maatregel'],
          [
            [
              'Camera/notificaties werken niet op emulator',
              'Testen op fysiek device met Expo Go',
            ],
            [
              'Geen productie-backend',
              'Lokale PC-API (Express + JSON) + AsyncStorage',
            ],
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
        p(
          'Functie: formulier + camera/galerij; bij versturen sync via internet + vibratie/notificatie.'
        ),
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
        p('Functie: details tonen; statuswijziging triggert opnieuw vibratie + notificatie. Status wijzigen kan ook op het PC-dashboard (zelfde statusflow via PATCH).'),
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
        bullet(
          'Internet: fetch naar lokale PC-API (server/ poort 3001, meldingen.json) — GET/POST/PATCH over wifi'
        ),
        bullet(
          'Notificatie PC → telefoon: wachtrij (pending-notifications.json); app pollt en toont lokale statusbalk-notificatie + trillen (geen cloud-push)'
        ),
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
        h2('Gekozen stack'),
        table(
          ['Laag', 'Keuze', 'Taal'],
          [
            ['Mobiele app', 'Expo op React Native', 'TypeScript'],
            ['UI / device-API’s', 'React Native + Expo-modules', 'TypeScript'],
            ['PC-API + dashboard', 'Express (Node.js)', 'JavaScript'],
            ['Data', 'JSON op PC + AsyncStorage op telefoon', '—'],
          ],
          [2800, 3600, 2600]
        ),
        p(
          'Native-platform: de app draait als Android-app (via Expo Go). React Native vertaalt TypeScript/JS naar native UI-componenten. We schrijven geen Kotlin/Java zelf, maar gebruiken wel native hardware (camera, vibratie) via Expo-bruggen.'
        ),

        h2('Programmeertaal op mobiel: waarom TypeScript?'),
        numbered(
          'TypeScript = JavaScript + types → minder fouten, makkelijker uit te leggen (Melding, statussen, API-responses).',
          1
        ),
        numbered(
          'Past bij React Native / Expo (standaard in tutorials en schoolcontext JS/TS).',
          2
        ),
        numbered(
          'Eén taal voor app-logica én dezelfde mentaliteit als de PC-server in Node.',
          3
        ),
        p('Niet gekozen: Kotlin (alleen Android), Dart (Flutter), Swift (alleen iOS).'),

        h2('Waarom Expo / React Native — en niet de andere?'),
        table(
          ['Optie', 'Wat het is', 'Waarom wel / niet'],
          [
            [
              'Expo + React Native (gekozen)',
              'Cross-platform; hardware via modules; Expo Go',
              'Snel presenteren; camera/netwerk/trillen; één codebase; past bij TypeScript',
            ],
            [
              'Native Android (Kotlin)',
              'Echte Android-app in Android Studio',
              'Sterk, maar alleen Android; meer setup; langer voor dezelfde demo',
            ],
            [
              'Flutter (Dart)',
              'Cross-platform van Google',
              'Goed voor UI, maar lescontext is JS/TS — extra taal kost te veel tijd',
            ],
            [
              'PWA (browser)',
              'Website “als app”',
              'Camera/trillen zwakker; minder overtuigende hardware-demo',
            ],
          ],
          [2600, 2800, 3600]
        ),
        h3('Wat bedoelen we met “native”?'),
        bullet('We bouwen geen pure Kotlin/Swift-app.'),
        bullet('Camera / galerij → expo-image-picker'),
        bullet('Trillen → expo-haptics + React Native Vibration'),
        bullet('Internet → fetch naar onze PC-API'),
        bullet(
          'Expo Go levert die native modules al gebundeld; daarom presenteren zonder eigen android/-project.'
        ),

        h2('Hoe versturen we een melding? (telefoon → PC)'),
        numbered(
          'Gebruiker vult titel, categorie, locatie, beschrijving in en maakt/kiest een foto (nieuw.tsx).',
          1
        ),
        numbered('Validatie: titel + beschrijving + foto verplicht.', 2),
        numbered('App bouwt een Melding-object (id, status nieuw, fotoBase64, …).', 3),
        numbered(
          'syncMelding (services/api.ts) doet HTTP POST naar http://<pc-ip>:3001/api/meldingen (zelfde wifi).',
          4
        ),
        numbered(
          'PC-server (server/index.js) schrijft de melding naar server/data/meldingen.json.',
          5
        ),
        numbered('Dashboard op http://localhost:3001 toont de melding live.', 6),
        numbered(
          'Bij succes: lokaal opslaan + successFeedback (trillen) + bevestigingsscherm.',
          7
        ),
        p(
          'Status wijzigen: op de telefoon (detailscherm) of op het PC-dashboard — beide doen een HTTP PATCH naar /api/meldingen/:id met de nieuwe status (nieuw / in behandeling / afgerond).'
        ),
        p(
          'Offline: als de PC-API niet bereikbaar is → foutmelding + optie “Lokaal opslaan” (AsyncStorage), zonder sync.'
        ),
        ...codeBlock([
          'Telefoon (Expo)  --POST/PATCH JSON-->  PC Express :3001  -->  meldingen.json',
          '                                              |',
          '                                              v',
          '                                       Dashboard (browser, status wijzigen)',
        ]),

        h2('Hoe sturen we een notificatie naar de telefoon? (PC → telefoon)'),
        p(
          'We gebruiken geen Firebase / Apple Push / Google FCM. Push via externe server staat bewust buiten scope. Echte remote push werkt in Expo Go op Android ook niet (SDK 53+).'
        ),
        h3('Wat we wél doen: wachtrij + polling + lokale statusbalk-notificatie'),
        numbered(
          'Op het dashboard klik je “Stuur notificatie” (of maak je een PC-melding met “naar telefoon”).',
          1
        ),
        numbered(
          'Browser doet POST /api/notify (of POST /api/meldingen met notifyPhone: true).',
          2
        ),
        numbered('Server zet een bericht in pending-notifications.json.', 3),
        numbered(
          'De app (usePcNotifications in _layout.tsx) pollt elke 4 seconden GET /api/notify/pending zolang de app open/actief is.',
          4
        ),
        numbered('Server geeft de wachtrij terug en leegt die.', 5),
        numbered(
          'App plant een lokale systeemnotificatie (expo-notifications → statusbalk) + trilt.',
          6
        ),
        ...codeBlock([
          'Dashboard  --POST /api/notify-->  pending-notifications.json',
          '                                       ^',
          'Telefoon   --GET /api/notify/pending---+  (elke 4s, app open)',
          '           --> lokale notificatie (statusbalk) + vibratie',
        ]),
        h3('Waarom deze manier, niet “echte” push?'),
        table(
          ['Aanpak', 'Voordeel', 'Nadeel / waarom niet'],
          [
            [
              'Polling + lokale notificatie (gekozen)',
              'Zelfde look als push in de statusbalk; werkt in Expo Go; geen cloud',
              'Alleen als de app open is (pollt)',
            ],
            [
              'FCM / APNs (echte push)',
              'Werkt op achtergrond',
              'Cloud, keys, buiten scope; niet in Expo Go Android',
            ],
          ],
          [2800, 3200, 3000]
        ),
        p(
          'Presentatietip: houd de Expo-app open → klik op het dashboard “Stuur notificatie” → binnen ~4 seconden trillen + melding in de statusbalk. Sta notificaties toe als Android daarom vraagt.',
          { italics: true }
        ),

        h2('Hardware die we aantonen'),
        table(
          ['Hardware', 'Module / API', 'Wanneer'],
          [
            ['Camera / galerij', 'expo-image-picker', 'Nieuwe melding'],
            [
              'Internet',
              'fetch naar PC-API',
              'Ophalen + versturen meldingen + notify-poll',
            ],
            [
              'Trillen',
              'expo-haptics + Vibration',
              'Na versturen, statuswijziging, PC-notificatie',
            ],
            [
              'Notificatie (statusbalk)',
              'expo-notifications (lokaal)',
              'Bericht vanaf PC-dashboard na poll',
            ],
          ],
          [2500, 3200, 3300]
        ),
        h2('Projectstructuur'),
        ...codeBlock([
          'app/                 # Expo React Native (TypeScript)',
          '  app/               # Schermen (Expo Router)',
          '  services/          # api, config, storage, feedback, photos',
          '  hooks/             # usePcNotifications (poll PC → telefoon)',
          'server/              # Express API + dashboard (JavaScript)',
          '  data/              # meldingen.json, pending-notifications.json',
          'docs/                # Opdrachten 1–5',
        ]),
        h2('Akkoord opdrachtgever'),
        table(
          ['Onderdeel', 'Besluit', 'Datum', 'Handtekening'],
          [
            ['Expo + React Native + TypeScript', '☐ Akkoord', '……', '……'],
            ['PC-API + polling i.p.v. cloud-push', '☐ Akkoord', '……', '……'],
          ],
          [4000, 2000, 1500, 1500]
        ),

        pageBreak(),

        // ===== OPDRACHT 5 =====
        h1('Opdracht 5 — Testplan en rapportage'),
        h2('Doel'),
        p(
          'Controleren of Campus Melder voldoet aan de eisen: schermen, camera, internetsync en geluid/trillen.'
        ),
        h2('Testdatum'),
        p('18 november 2026'),
        h2('Regels voor dit rapport'),
        bullet(
          'Slaagcriteria: wat je op het scherm ziet — niet wat de code intern doet.'
        ),
        bullet('Screenshots, logs of .tsx-bestanden dienen als bewijs.'),
        bullet('Screenshots/logs: docs/screenshots/ (lokaal).'),
        h2('Tesomgeving'),
        table(
          ['Onderdeel', 'Waarde'],
          [
            ['Project', 'Campus Melder (Expo + TypeScript)'],
            ['OS development', 'Windows 10'],
            ['API', 'Lokale PC-API op poort 3001 (server/)'],
            ['Geautomatiseerd', 'TypeScript-compiler + HTTP GET/POST naar PC-API'],
            ['Device-UI', 'Expo Go op Android'],
          ],
          [3000, 6000]
        ),
        h2('Testplan'),
        p('Per test: stappen, verwacht resultaat, geslaagd-criterium, resultaat en bewijs.'),
        h3('T1 — App compileert / TypeScript OK'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'cd app → npx tsc --noEmit'],
            ['Verwacht', 'Geen TypeScript-fouten in de terminal'],
            ['Geslaagd als', 'In de terminal exit code 0 / geen errorregels'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'docs/screenshots/T1-tsc-output.txt'],
          ],
          [2500, 6500]
        ),
        h3('T2 — Internet: ophalen (GET)'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'HTTP GET http://localhost:3001/api/health'],
            ['Verwacht', 'Status 200; dashboard toont API online'],
            ['Geslaagd als', 'Je ziet HTTP 200 / ok:true en op het dashboard “API online”'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T2-get-health.txt + T2-dashboard-api-online.png'],
          ],
          [2500, 6500]
        ),
        h3('T3 — Internet: versturen (POST sync)'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'HTTP POST /api/meldingen met melding + foto'],
            ['Verwacht', 'Status 201; melding met foto op dashboard'],
            ['Geslaagd als', 'Op het dashboard staat de nieuwe melding met titel + foto'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T3-post-result.txt + T3-T11-melding-bovenaan-met-foto.png'],
          ],
          [2500, 6500]
        ),
        h3('T4 — App start en toont overzicht'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'npx expo start → Expo Go → Home'],
            ['Verwacht', 'Titel Campus Melder + knop Nieuwe melding'],
            ['Geslaagd als', 'Je ziet het Home-scherm zonder crash'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'app/app/index.tsx'],
          ],
          [2500, 6500]
        ),
        h3('T5 — Validatie zonder titel/beschrijving'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Versturen zonder titel/beschrijving'],
            ['Verwacht', 'Alert: Vul minimaal een titel en beschrijving in.'],
            [
              'Geslaagd als',
              'Die alert-tekst staat op het scherm; geen nieuwe melding in de lijst',
            ],
            ['Resultaat', 'OK'],
            ['Bewijs', 'app/app/nieuw.tsx'],
          ],
          [2500, 6500]
        ),
        h3('T6 — Validatie zonder foto'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Titel + beschrijving, geen foto → Versturen'],
            ['Verwacht', 'Alert: Foto verplicht'],
            ['Geslaagd als', 'Die alert staat op het scherm; melding niet verstuurd'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'app/app/nieuw.tsx'],
          ],
          [2500, 6500]
        ),
        h3('T7 — Melding met camera/foto'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Camera/galerij → foto → versturen'],
            ['Verwacht', 'Foto in preview; na sync foto op dashboard'],
            ['Geslaagd als', 'Je ziet de foto in preview én op het dashboard'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T3-T11-melding-bovenaan-met-foto.png'],
          ],
          [2500, 6500]
        ),
        h3('T8 — Verzenden met netwerk + vibratie/notificatie'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Versturen met netwerk; dashboard Stuur notificatie'],
            [
              'Verwacht',
              'Bevestiging; telefoon trilt; statusbalk-notificatie + trillen',
            ],
            [
              'Geslaagd als',
              'Je ziet bevestiging / statusbalk-notificatie en voelt trillen',
            ],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T8-dashboard-stuur-notificatie.png'],
          ],
          [2500, 6500]
        ),
        h3('T9 — Foutpad zonder netwerk'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Wifi/vliegtuigmodus uit → versturen'],
            ['Verwacht', 'Foutmelding + optie Lokaal opslaan'],
            [
              'Geslaagd als',
              'Je ziet die fout-alert en “Lokaal opslaan”; app crasht niet',
            ],
            ['Resultaat', 'OK'],
            ['Bewijs', 'app/app/nieuw.tsx'],
          ],
          [2500, 6500]
        ),
        h3('T10 — Status wijzigen'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Op dashboard of telefoon “in behandeling” kiezen'],
            ['Verwacht', 'Badge verandert van NIEUW naar IN BEHANDELING'],
            ['Geslaagd als', 'Op het scherm staat badge IN BEHANDELING'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T10-status-in-behandeling.png'],
          ],
          [2500, 6500]
        ),
        h3('T11 — Nieuwe melding staat bovenaan'),
        table(
          ['Onderdeel', 'Inhoud'],
          [
            ['Stappen', 'Nieuwe melding versturen → lijst bekijken'],
            ['Verwacht', 'Nieuwste melding bovenaan'],
            ['Geslaagd als', 'Je ziet de nieuwe titel bovenaan'],
            ['Resultaat', 'OK'],
            ['Bewijs', 'T3-T11-melding-bovenaan-met-foto.png'],
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
            ['T4 Home start', 'OK'],
            ['T5 Validatie tekst', 'OK'],
            ['T6 Validatie foto', 'OK'],
            ['T7 Camera/foto', 'OK'],
            ['T8 Sync + feedback', 'OK'],
            ['T9 Offline-pad', 'OK'],
            ['T10 Status', 'OK'],
            ['T11 Bovenaan', 'OK'],
          ],
          [4000, 5000]
        ),
        p('Geslaagd: 11/11'),
        h2('Aanpassingen tijdens testen'),
        table(
          ['Aanpassing', 'Reden'],
          [
            ['detail/[id].tsx: fotoUri ?? undefined', 'TypeScript-fout T1 (uri mag geen null)'],
            ['Slaagcriteria in schermtaal', 'Niet “useFocusEffect”, wel “staat bovenaan”'],
            ['Foto verplicht + Lokaal opslaan', 'Camera-flow en offline-pad aantoonbaar'],
          ],
          [4000, 5000]
        ),
        h2('Conclusie'),
        p(
          'Campus Melder voldoet aan de eisen: schermen, camera/foto, internetsync via PC-API, statuswijziging, offline-pad, trillen en PC→telefoon-notificatie via polling. Alle tests (T1–T11) zijn OK.'
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
