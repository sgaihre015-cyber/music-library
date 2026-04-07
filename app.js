const express = require('express');

const app = express();
app.use(express.json());

let tracks = [];
let nextId = 1;

const toId = (value) => Number.parseInt(value, 10);

const validateTrack = (body) => {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a JSON object';
  }
  if (!body.title || typeof body.title !== 'string') {
    return 'title is required and must be a string';
  }
  if (!body.artist || typeof body.artist !== 'string') {
    return 'artist is required and must be a string';
  }
  return null;
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tracks', (_req, res) => {
  res.json(tracks);
});

app.post('/api/tracks', (req, res) => {
  const error = validateTrack(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const track = {
    id: nextId++,
    title: req.body.title.trim(),
    artist: req.body.artist.trim(),
    album: typeof req.body.album === 'string' ? req.body.album.trim() : '',
    year: Number.isInteger(req.body.year) ? req.body.year : null
  };

  tracks.push(track);
  return res.status(201).json(track);
});

app.get('/api/tracks/:id', (req, res) => {
  const id = toId(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid track id' });
  }

  const track = tracks.find((item) => item.id === id);
  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }

  return res.json(track);
});

app.put('/api/tracks/:id', (req, res) => {
  const id = toId(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid track id' });
  }

  const index = tracks.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Track not found' });
  }

  const error = validateTrack(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const updated = {
    id,
    title: req.body.title.trim(),
    artist: req.body.artist.trim(),
    album: typeof req.body.album === 'string' ? req.body.album.trim() : '',
    year: Number.isInteger(req.body.year) ? req.body.year : null
  };

  tracks[index] = updated;
  return res.json(updated);
});

app.delete('/api/tracks/:id', (req, res) => {
  const id = toId(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid track id' });
  }

  const index = tracks.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Track not found' });
  }

  tracks.splice(index, 1);
  return res.status(204).send();
});

app.resetState = () => {
  tracks = [];
  nextId = 1;
};

module.exports = app;
