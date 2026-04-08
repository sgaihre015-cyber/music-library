const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { db, initializeDb } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, '..', '..', 'APIDOC')));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  })
);

function validateAlbum(payload) {
  const required = ['title', 'artist', 'genre', 'year', 'tracks'];
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === null);

  if (missing.length) {
    return { valid: false, message: `Missing fields: ${missing.join(', ')}` };
  }

  if ([payload.title, payload.artist, payload.genre].some((value) => typeof value !== 'string' || !value.trim())) {
    return { valid: false, message: 'title, artist and genre must be non-empty strings' };
  }

  if (!Number.isInteger(payload.year) || payload.year < 1900 || payload.year > new Date().getFullYear() + 1) {
    return { valid: false, message: 'year must be a valid integer between 1900 and next year' };
  }

  if (!Number.isInteger(payload.tracks) || payload.tracks < 1 || payload.tracks > 50) {
    return { valid: false, message: 'tracks must be an integer between 1 and 50' };
  }

  return { valid: true };
}

/**
 * @api {get} /health Health check
 * @apiName Health
 * @apiGroup System
 * @apiSuccess {String} status API status.
 */
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * @api {get} /api/albums List albums
 * @apiName GetAlbums
 * @apiGroup Albums
 * @apiSuccess {Object[]} albums List of albums.
 */
app.get('/api/albums', (_, res) => {
  db.all('SELECT * FROM albums ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch albums' });
    }

    res.json({ data: rows });
  });
});

/**
 * @api {get} /api/albums/:id Get album by ID
 * @apiName GetAlbum
 * @apiGroup Albums
 * @apiParam {Number} id Album unique ID.
 */
app.get('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid album id' });
  }

  db.get('SELECT * FROM albums WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch album' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json({ data: row });
  });
});

/**
 * @api {post} /api/albums Create album
 * @apiName CreateAlbum
 * @apiGroup Albums
 */
app.post('/api/albums', (req, res) => {
  const validation = validateAlbum(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const { title, artist, genre, year, tracks } = req.body;
  db.run(
    'INSERT INTO albums (title, artist, genre, year, tracks) VALUES (?, ?, ?, ?, ?)',
    [title.trim(), artist.trim(), genre.trim(), year, tracks],
    function insertHandler(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create album' });
      }

      res.status(201).json({ data: { id: this.lastID, title, artist, genre, year, tracks } });
    }
  );
});

/**
 * @api {put} /api/albums/:id Update album
 * @apiName UpdateAlbum
 * @apiGroup Albums
 * @apiParam {Number} id Album unique ID.
 */
app.put('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid album id' });
  }

  const validation = validateAlbum(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const { title, artist, genre, year, tracks } = req.body;
  db.run(
    'UPDATE albums SET title = ?, artist = ?, genre = ?, year = ?, tracks = ? WHERE id = ?',
    [title.trim(), artist.trim(), genre.trim(), year, tracks, id],
    function updateHandler(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update album' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Album not found' });
      }

      res.json({ data: { id, title, artist, genre, year, tracks } });
    }
  );
});

/**
 * @api {delete} /api/albums/:id Delete album
 * @apiName DeleteAlbum
 * @apiGroup Albums
 * @apiParam {Number} id Album unique ID.
 */
app.delete('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid album id' });
  }

  db.run('DELETE FROM albums WHERE id = ?', [id], function deleteHandler(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete album' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json({ data: { id } });
  });
});

app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

async function setup() {
  await initializeDb();
}

module.exports = {
  app,
  setup
};
