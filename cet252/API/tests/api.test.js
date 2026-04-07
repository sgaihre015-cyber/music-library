const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testDbPath = path.join(__dirname, 'test-music-library.db');
process.env.DB_FILE = testDbPath;

const app = require('../src/app');
const { initDb, closeDb } = require('../src/db');

beforeAll(async () => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  await initDb();
});

afterAll(async () => {
  await closeDb();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('Music Library API', () => {
  test('GET /api/tracks returns seeded data', async () => {
    const res = await request(app).get('/api/tracks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(20);
  });

  test('POST /api/tracks creates a new track', async () => {
    const payload = {
      title: 'New Song',
      artist: 'Test Artist',
      album: 'Test Album',
      genre: 'Test',
      year: 2026,
      duration_seconds: 210
    };

    const res = await request(app).post('/api/tracks').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(payload.title);
    expect(res.body.id).toBeDefined();
  });

  test('PUT /api/tracks/:id updates a track', async () => {
    const createRes = await request(app).post('/api/tracks').send({
      title: 'Original',
      artist: 'Artist',
      album: 'Album',
      genre: 'Genre',
      year: 2024,
      duration_seconds: 180
    });

    const res = await request(app)
      .put(`/api/tracks/${createRes.body.id}`)
      .send({
        title: 'Updated',
        artist: 'Artist',
        album: 'Album',
        genre: 'Genre',
        year: 2025,
        duration_seconds: 220
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(res.body.year).toBe(2025);
  });

  test('DELETE /api/tracks/:id removes a track', async () => {
    const createRes = await request(app).post('/api/tracks').send({
      title: 'Delete me',
      artist: 'Artist',
      album: 'Album',
      genre: 'Genre',
      year: 2024,
      duration_seconds: 180
    });

    const deleteRes = await request(app).delete(`/api/tracks/${createRes.body.id}`);
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/tracks/${createRes.body.id}`);
    expect(getRes.statusCode).toBe(404);
  });
});
