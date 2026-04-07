const express = require('express');
const cors = require('cors');
const { all, get, run } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Music Library API Docs</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #eef2f8;
        color: #1f2937;
      }
      header {
        background: linear-gradient(90deg, #0b4ea2, #0a67c8);
        color: #fff;
        text-align: center;
        padding: 1.4rem 1rem;
      }
      header h1 { margin: 0; font-size: 2rem; }
      header p { margin: 0.35rem 0 0; opacity: 0.92; }
      main {
        max-width: 1120px;
        margin: 1.2rem auto;
        padding: 0 1rem 1rem;
      }
      .links {
        background: #fff;
        border: 1px solid #d8e1ee;
        border-radius: 12px;
        padding: 0.9rem;
        margin-bottom: 1rem;
      }
      .links a {
        display: inline-block;
        margin: 0.25rem 0.5rem 0.25rem 0;
        background: #0b63c8;
        color: #fff;
        text-decoration: none;
        border-radius: 8px;
        padding: 0.45rem 0.7rem;
        font-weight: 600;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 0.9rem;
      }
      .card {
        background: #fff;
        border: 1px solid #d8e1ee;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
        padding: 0.9rem;
      }
      .method {
        display: inline-block;
        border-radius: 999px;
        padding: 0.12rem 0.55rem;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 0.4rem;
      }
      .get { background: #dbeafe; color: #1d4ed8; }
      .post { background: #dcfce7; color: #166534; }
      .put { background: #fef3c7; color: #92400e; }
      .delete { background: #fee2e2; color: #b91c1c; }
      code { background: #f8fafc; padding: 0.15rem 0.35rem; border-radius: 6px; }
      p { margin: 0.35rem 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>🎵 Music Library API</h1>
      <p>REST endpoints for tracks</p>
    </header>
    <main>
      <section class="links">
        <a href="/api/health">Health</a>
        <a href="/api/tracks">Get Tracks</a>
      </section>
      <section class="grid">
        <article class="card">
          <span class="method get">GET</span>
          <p><code>/api/health</code></p>
          <p>Check API status.</p>
        </article>
        <article class="card">
          <span class="method get">GET</span>
          <p><code>/api/tracks</code></p>
          <p>Get all tracks.</p>
        </article>
        <article class="card">
          <span class="method get">GET</span>
          <p><code>/api/tracks/:id</code></p>
          <p>Get single track by id.</p>
        </article>
        <article class="card">
          <span class="method post">POST</span>
          <p><code>/api/tracks</code></p>
          <p>Create a new track.</p>
        </article>
        <article class="card">
          <span class="method put">PUT</span>
          <p><code>/api/tracks/:id</code></p>
          <p>Update existing track.</p>
        </article>
        <article class="card">
          <span class="method delete">DELETE</span>
          <p><code>/api/tracks/:id</code></p>
          <p>Delete track by id.</p>
        </article>
      </section>
    </main>
  </body>
</html>`;

  res.type('html').send(html);
});

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
