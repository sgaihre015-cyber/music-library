const express = require('express');
const cors = require('cors');
const { all, get, run } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is available
 */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/**
 * @openapi
 * /api/tracks:
 *   get:
 *     summary: Retrieve all tracks
 *     tags:
 *       - Tracks
 *     responses:
 *       200:
 *         description: A list of tracks
 */
app.get('/api/tracks', async (_req, res) => {
  try {
    const tracks = await all('SELECT * FROM tracks ORDER BY id ASC');
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

/**
 * @openapi
 * /api/tracks/{id}:
 *   get:
 *     summary: Retrieve a track by id
 *     tags:
 *       - Tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Track found
 *       404:
 *         description: Track not found
 */
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await get('SELECT * FROM tracks WHERE id = ?', [req.params.id]);
    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

/**
 * @openapi
 * /api/tracks:
 *   post:
 *     summary: Create a new track
 *     tags:
 *       - Tracks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Track created
 *       400:
 *         description: Invalid payload
 */
app.post('/api/tracks', async (req, res) => {
  const { title, artist, album, genre, year, duration_seconds: durationSeconds } = req.body;

  if (!title || !artist || !album || !genre || !year || !durationSeconds) {
    res.status(400).json({ error: 'title, artist, album, genre, year and duration_seconds are required' });
    return;
  }

  try {
    const result = await run(
      `INSERT INTO tracks (title, artist, album, genre, year, duration_seconds)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, artist, album, genre, year, durationSeconds]
    );

    const created = await get('SELECT * FROM tracks WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create track' });
  }
});

/**
 * @openapi
 * /api/tracks/{id}:
 *   put:
 *     summary: Update an existing track
 *     tags:
 *       - Tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Track updated
 *       404:
 *         description: Track not found
 */
app.put('/api/tracks/:id', async (req, res) => {
  const { title, artist, album, genre, year, duration_seconds: durationSeconds } = req.body;

  if (!title || !artist || !album || !genre || !year || !durationSeconds) {
    res.status(400).json({ error: 'title, artist, album, genre, year and duration_seconds are required' });
    return;
  }

  try {
    const existing = await get('SELECT * FROM tracks WHERE id = ?', [req.params.id]);
    if (!existing) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    await run(
      `UPDATE tracks
       SET title = ?, artist = ?, album = ?, genre = ?, year = ?, duration_seconds = ?
       WHERE id = ?`,
      [title, artist, album, genre, year, durationSeconds, req.params.id]
    );

    const updated = await get('SELECT * FROM tracks WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update track' });
  }
});

/**
 * @openapi
 * /api/tracks/{id}:
 *   delete:
 *     summary: Delete a track by id
 *     tags:
 *       - Tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Track deleted
 *       404:
 *         description: Track not found
 */
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const existing = await get('SELECT * FROM tracks WHERE id = ?', [req.params.id]);
    if (!existing) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    await run('DELETE FROM tracks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Track deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete track' });
  }
});

module.exports = app;
