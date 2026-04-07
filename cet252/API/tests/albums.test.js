const request = require('supertest');
const { app, setup } = require('../src/app');

beforeAll(async () => {
  await setup();
});

describe('Music Library API', () => {
  test('GET /health returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /api/albums returns seeded records', async () => {
    const response = await request(app).get('/api/albums');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(20);
  });

  test('POST + PUT + DELETE /api/albums CRUD flow', async () => {
    const createResponse = await request(app).post('/api/albums').send({
      title: 'Test Album',
      artist: 'Test Artist',
      genre: 'Rock',
      year: 2024,
      tracks: 10
    });

    expect(createResponse.status).toBe(201);
    const albumId = createResponse.body.data.id;

    const updateResponse = await request(app).put(`/api/albums/${albumId}`).send({
      title: 'Updated Album',
      artist: 'Updated Artist',
      genre: 'Alternative',
      year: 2025,
      tracks: 11
    });
    expect(updateResponse.status).toBe(200);

    const deleteResponse = await request(app).delete(`/api/albums/${albumId}`);
    expect(deleteResponse.status).toBe(200);
  });

  test('POST /api/albums validates payload', async () => {
    const response = await request(app).post('/api/albums').send({ title: '' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBeTruthy();
  });
});
