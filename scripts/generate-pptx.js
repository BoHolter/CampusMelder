/**
 * Genereert docs/Campus-Melder-Presentatie.pptx
 * Run: node scripts/generate-pptx.js  (vereist pptxgenjs)
 */
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const OUT = path.join(__dirname, '..', 'docs', 'Campus-Melder-Presentatie.pptx');
const SHOTS = path.join(__dirname, '..', 'docs', 'screenshots');

const COLORS = {
  bg: '0F2A1F',
  bgAlt: '163528',
  card: '1C4333',
  accent: '7CDBA0',
  accentSoft: 'A8E6C3',
  text: 'F4F7F5',
  muted: 'B7C9BF',
  warn: 'F0C674',
};

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.author = 'Campus Melder';
pptx.title = 'Campus Melder — Presentatie';

function baseSlide(title) {
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: COLORS.bg },
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.18,
    h: '100%',
    fill: { color: COLORS.accent },
  });
  if (title) {
    s.addText(title, {
      x: 0.55,
      y: 0.35,
      w: 12.2,
      h: 0.6,
      fontSize: 28,
      fontFace: 'Calibri',
      bold: true,
      color: COLORS.text,
    });
  }
  return s;
}

function bullets(slide, items, opts = {}) {
  slide.addText(
    items.map((t) => ({
      text: t,
      options: { bullet: true, breakLine: true },
    })),
    {
      x: opts.x ?? 0.7,
      y: opts.y ?? 1.2,
      w: opts.w ?? 11.8,
      h: opts.h ?? 5.5,
      fontSize: opts.fontSize ?? 20,
      fontFace: 'Calibri',
      color: COLORS.text,
      paraSpaceAfter: 10,
    }
  );
}

/** Screenshot-slide: titel + caption + afbeelding. */
function shotSlide(title, caption, fileName) {
  const file = path.join(SHOTS, fileName);
  const s = baseSlide(title);
  s.addText(caption, {
    x: 0.7,
    y: 1.05,
    w: 12,
    h: 0.45,
    fontSize: 16,
    fontFace: 'Calibri',
    color: COLORS.muted,
  });
  s.addImage({
    path: file,
    x: 1.4,
    y: 1.6,
    w: 10.5,
    h: 5.4,
    sizing: { type: 'contain', w: 10.5, h: 5.4 },
  });
  return s;
}

// --- 1. Titel ---
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: COLORS.bg },
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: '100%',
    h: 0.12,
    fill: { color: COLORS.accent },
  });
  s.addText('CAMPUS MELDER', {
    x: 0.8,
    y: 2.2,
    w: 11.5,
    h: 0.9,
    fontSize: 48,
    fontFace: 'Calibri',
    bold: true,
    color: COLORS.accent,
  });
  s.addText('Presentatie & live demo', {
    x: 0.8,
    y: 3.2,
    w: 11.5,
    h: 0.5,
    fontSize: 26,
    fontFace: 'Calibri',
    color: COLORS.text,
  });
  s.addText(
    'Expo · React Native · TypeScript  ·  PC-API + dashboard  ·  Camera · Sync · Notificatie',
    {
      x: 0.8,
      y: 6.4,
      w: 11.5,
      h: 0.4,
      fontSize: 14,
      fontFace: 'Calibri',
      color: COLORS.muted,
    }
  );
}

// --- 2. Agenda ---
{
  const s = baseSlide('Agenda — wat we laten zien');
  bullets(s, [
    'Melding met foto → verschijnt op het PC-dashboard',
    'Wifi uit: wat zie je op het scherm?',
    'Notificatie vanaf het dashboard + trillen',
    'usePcNotifications: hoe & waarom polling',
    'Kleine live code-aanpassing',
  ]);
}

// --- 3. Demo 1 ---
{
  const s = baseSlide('Demo 1 — Melding met foto op het dashboard');
  bullets(
    s,
    [
      'Op de telefoon: nieuwe melding → foto maken → versturen',
      'Op het scherm: bevestiging + melding staat bovenaan in de lijst',
      'Op de PC (localhost:3001): dezelfde melding met foto zichtbaar',
      'Slaagcriterium: beschrijf wat je ziet — “foto en titel staan op het dashboard”',
    ],
    { y: 1.15 }
  );
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7,
    y: 5.5,
    w: 11.8,
    h: 1.3,
    fill: { color: COLORS.card },
    rectRadius: 0.1,
  });
  s.addText(
    'Tip screencast: telefoon + browser naast elkaar. Eerst versturen, dan dashboard laten zien.',
    {
      x: 0.95,
      y: 5.75,
      w: 11.3,
      h: 0.8,
      fontSize: 16,
      fontFace: 'Calibri',
      color: COLORS.accentSoft,
    }
  );
}

shotSlide(
  'Screenshot — melding met foto op het dashboard',
  'Wat je ziet: “Lekkage bij toilet A2” staat bovenaan, status NIEUW, met foto links.',
  '02-melding-met-foto.png'
);

// --- 4. Demo 2 ---
{
  const s = baseSlide('Demo 2 — Wifi uit');
  bullets(s, [
    'Wifi / vliegtuigmodus aan → melding versturen',
    'Op het scherm: fout over geen internet',
    'Keuze: “Lokaal opslaan” (AsyncStorage) — app crasht niet',
    'Wifi weer aan: later syncen / opnieuw versturen tonen',
  ]);
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7,
    y: 5.5,
    w: 11.8,
    h: 1.3,
    fill: { color: COLORS.card },
    rectRadius: 0.1,
  });
  s.addText(
    'Nog geen PC-screenshot hiervoor — dit is telefoon-UI. Zelf opnemen met Expo Go + wifi uit.',
    {
      x: 0.95,
      y: 5.75,
      w: 11.3,
      h: 0.8,
      fontSize: 16,
      fontFace: 'Calibri',
      color: COLORS.warn,
    }
  );
}

// --- 5. Demo 3 ---
{
  const s = baseSlide('Demo 3 — Notificatie vanaf dashboard + trillen');
  bullets(s, [
    'App open houden op de telefoon (Expo Go)',
    'Op het dashboard: knop “Stuur notificatie”',
    'Op het scherm: melding in de statusbalk / notification tray',
    'Telefoon trilt (haptics / Vibration)',
    'Slaagcriterium: “ik zie de notificatie en voel het trillen” — niet de API-naam',
  ]);
}

shotSlide(
  'Screenshot — dashboard “Stuur notificatie”',
  'Wat je ziet: paneel Notificatie naar telefoon + API online. Telefoon-notificatie + trillen live tonen.',
  '01-dashboard-overview.png'
);

shotSlide(
  'Screenshot — notificatie verstuurd vanaf PC',
  'Wat je ziet: knop Stuur notificatie klaar; bericht gaat in de wachtrij voor polling.',
  '03-notificatie-verstuurd.png'
);

// --- 6. usePcNotifications ---
{
  const s = baseSlide('usePcNotifications — hoe werkt het?');
  bullets(
    s,
    [
      'Hook in _layout.tsx: pollt zolang de app actief is',
      'Elke 4 seconden: GET /api/notify/pending',
      'Server geeft wachtrij terug en leegt die',
      'App toont lokale systeemnotificatie + trilt (successFeedback)',
    ],
    { y: 1.1, h: 3.2 }
  );
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7,
    y: 4.4,
    w: 11.8,
    h: 2.4,
    fill: { color: COLORS.card },
    rectRadius: 0.1,
  });
  s.addText(
    'Dashboard  →  POST /api/notify  →  pending-notifications.json\nTelefoon   →  GET /api/notify/pending (elke 4s)  →  statusbalk + vibratie',
    {
      x: 0.95,
      y: 4.7,
      w: 11.3,
      h: 1.8,
      fontSize: 18,
      fontFace: 'Consolas',
      color: COLORS.accentSoft,
      valign: 'middle',
    }
  );
}

// --- 7. Waarom polling ---
{
  const s = baseSlide('Waarom polling (geen FCM / cloud-push)?');
  const rows = [
    [
      { text: 'Aanpak', options: { bold: true, color: COLORS.bg } },
      { text: 'Voordeel', options: { bold: true, color: COLORS.bg } },
      { text: 'Nadeel / waarom niet', options: { bold: true, color: COLORS.bg } },
    ],
    [
      'Polling + lokale notificatie',
      'Werkt in Expo Go; statusbalk-look; geen cloud-keys',
      'Alleen als de app open/actief is',
    ],
    [
      'FCM / APNs (echte push)',
      'Werkt op achtergrond',
      'Buiten scope; niet in Expo Go Android',
    ],
  ];
  s.addTable(rows, {
    x: 0.7,
    y: 1.3,
    w: 11.8,
    colW: [3.6, 4.1, 4.1],
    border: [
      { pt: 0.5, color: '2A5040' },
      { pt: 0.5, color: '2A5040' },
      { pt: 0.5, color: '2A5040' },
      { pt: 0.5, color: '2A5040' },
    ],
    fontFace: 'Calibri',
    fontSize: 14,
    color: COLORS.text,
    fill: { color: COLORS.card },
    align: 'left',
    valign: 'middle',
  });
  // header row color via shape overlay is hard; add note instead
  s.addText(
    'Keuze: lokale PC + wifi-demo. Push via externe server staat bewust buiten scope.',
    {
      x: 0.7,
      y: 5.6,
      w: 11.8,
      h: 0.8,
      fontSize: 16,
      fontFace: 'Calibri',
      color: COLORS.warn,
    }
  );
}

// --- 8. Live code ---
{
  const s = baseSlide('Live: kleine code-aanpassing');
  bullets(s, [
    'Kies iets kleins en zichtbaars (bijv. knoptekst, titel, poll-interval tonen)',
    'Wijzig → save → Expo herlaadt → effect op het scherm laten zien',
    'Koppel terug: “dit is TypeScript / Expo Router / onze hook”',
    'Houd het kort — 30–60 seconden is genoeg',
  ]);
}

// --- 9. Slaagcriteria ---
{
  const s = baseSlide('Slaagcriteria — zeg wat je ziet');
  bullets(
    s,
    [
      'Niet: “useFocusEffect herlaadt” → wel: “de nieuwe melding staat bovenaan”',
      'Niet: “POST 201” → wel: “de foto staat op het dashboard”',
      'Niet: “successFeedback” → wel: “telefoon trilt en notificatie verschijnt”',
      'Rapport: alleen “OK” bij tests die je echt gedaan hebt',
    ],
    { y: 1.15 }
  );
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.7,
    y: 5.4,
    w: 11.8,
    h: 1.4,
    fill: { color: COLORS.card },
    rectRadius: 0.1,
  });
  s.addText(
    'Bewijs: screenshot, screencast, of .tsx-bestand dat bij de test hoort.',
    {
      x: 0.95,
      y: 5.75,
      w: 11.3,
      h: 0.7,
      fontSize: 18,
      fontFace: 'Calibri',
      color: COLORS.accentSoft,
    }
  );
}

// --- 10. Screencast checklist ---
{
  const s = baseSlide('Screencast-checklist');
  const checks = [
    ['☐', 'Melding met foto → zichtbaar op PC-dashboard'],
    ['☐', 'Wifi uit → foutmelding + lokaal opslaan'],
    ['☐', 'Dashboard-notificatie → statusbalk + trillen'],
    ['☐', 'Uitleg usePcNotifications + waarom polling'],
    ['☐', 'Kleine live code-aanpassing'],
  ];
  checks.forEach((row, i) => {
    const y = 1.25 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.7,
      y,
      w: 11.8,
      h: 0.8,
      fill: { color: COLORS.card },
      rectRadius: 0.08,
    });
    s.addText(row[0], {
      x: 0.95,
      y: y + 0.15,
      w: 0.7,
      h: 0.5,
      fontSize: 22,
      fontFace: 'Calibri',
      color: COLORS.accent,
    });
    s.addText(row[1], {
      x: 1.7,
      y: y + 0.18,
      w: 10.4,
      h: 0.45,
      fontSize: 20,
      fontFace: 'Calibri',
      color: COLORS.text,
    });
  });
}

// --- 11. Stack kort ---
{
  const s = baseSlide('Techniek in één slide');
  bullets(s, [
    'App: Expo + React Native + TypeScript',
    'Hardware: camera (image-picker), trillen (haptics), internet (fetch)',
    'PC: Express API + dashboard, data in meldingen.json',
    'Sync: zelfde wifi — telefoon ↔ http://<pc-ip>:3001',
    'PC → telefoon: wachtrij + polling, geen Firebase',
  ]);
}

// --- 12. Einde ---
{
  const s = pptx.addSlide();
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: COLORS.bg },
  });
  s.addText('Vragen?', {
    x: 0.8,
    y: 2.8,
    w: 11.5,
    h: 0.9,
    fontSize: 44,
    fontFace: 'Calibri',
    bold: true,
    color: COLORS.accent,
    align: 'center',
  });
  s.addText('Campus Melder — live demo klaar', {
    x: 0.8,
    y: 3.9,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    fontFace: 'Calibri',
    color: COLORS.muted,
    align: 'center',
  });
}

pptx
  .writeFile({ fileName: OUT })
  .then(() => {
    console.log('Geschreven:', OUT);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
