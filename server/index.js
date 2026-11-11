const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'meldingen.json');
const NOTIFY_FILE = path.join(__dirname, 'data', 'pending-notifications.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function sortMeldingen(list) {
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'campus-melder-api' });
});

app.get('/api/meldingen', (_req, res) => {
  const list = sortMeldingen(readJson(DATA_FILE, []));
  res.json(list);
});

app.get('/api/meldingen/:id', (req, res) => {
  const list = readJson(DATA_FILE, []);
  const item = list.find((m) => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Niet gevonden' });
  res.json(item);
});

app.post('/api/meldingen', (req, res) => {
  const list = readJson(DATA_FILE, []);
  const notifyPhone = Boolean(req.body?.notifyPhone);
  const melding = { ...req.body, synced: true };
  delete melding.notifyPhone;
  if (!melding.id) {
    melding.id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  if (!melding.titel || !String(melding.titel).trim()) {
    return res.status(400).json({ error: 'titel verplicht' });
  }
  if (!melding.createdAt) {
    melding.createdAt = new Date().toISOString();
  }
  if (!melding.status) melding.status = 'nieuw';
  if (!melding.categorie) melding.categorie = 'Overig';
  if (melding.beschrijving == null) melding.beschrijving = '';
  if (melding.locatie == null) melding.locatie = '';
  if (melding.fotoUri === undefined) melding.fotoUri = null;
  if (melding.fotoBase64 === undefined) melding.fotoBase64 = null;

  const idx = list.findIndex((m) => m.id === melding.id);
  if (idx >= 0) list[idx] = melding;
  else list.unshift(melding);
  writeJson(DATA_FILE, list);

  if (notifyPhone) {
    const queue = readJson(NOTIFY_FILE, []);
    queue.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: 'Nieuwe melding van PC',
      body: String(melding.titel).trim(),
      createdAt: new Date().toISOString(),
      meldingId: melding.id,
    });
    writeJson(NOTIFY_FILE, queue);
  }

  res.status(201).json(melding);
});

app.patch('/api/meldingen/:id', (req, res) => {
  const list = readJson(DATA_FILE, []);
  const idx = list.findIndex((m) => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Niet gevonden' });
  list[idx] = { ...list[idx], ...req.body, id: list[idx].id };
  writeJson(DATA_FILE, list);
  res.json(list[idx]);
});

/** Queue a notification for the phone (polled by Expo app). */
app.post('/api/notify', (req, res) => {
  const title = String(req.body?.title || 'Campus Melder').trim();
  const body = String(req.body?.body || 'Nieuwe melding van de PC').trim();
  const queue = readJson(NOTIFY_FILE, []);
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    body,
    createdAt: new Date().toISOString(),
  };
  queue.push(item);
  writeJson(NOTIFY_FILE, queue);
  res.status(201).json({ ok: true, queued: item });
});

/** Phone polls this; returns and clears pending notifications. */
app.get('/api/notify/pending', (_req, res) => {
  const queue = readJson(NOTIFY_FILE, []);
  writeJson(NOTIFY_FILE, []);
  res.json(queue);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Campus Melder API + dashboard: http://localhost:${PORT}`);
  console.log(`Telefoon (zelfde wifi): http://10.74.207.118:${PORT}`);
});
