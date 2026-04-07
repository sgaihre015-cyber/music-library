const request = require('supertest');
const app = require('../app');

describe('Music Library API', () => {
  beforeEach(() => {
    app.resetState();
  });

  test('GET /api/health returns ok status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('tracks CRUD lifecycle works', async () => {
    const createResponse = await request(app).post('/api/tracks').send({
      title: 'Numb',
      artist: 'Linkin Park',
      album: 'Meteora',
      year: 2003
    });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.id).toBe(1);

    const listResponse = await request(app).get('/api/tracks');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);

    const getResponse = await request(app).get('/api/tracks/1');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.title).toBe('Numb');

    const updateResponse = await request(app).put('/api/tracks/1').send({
      title: 'In the End',
      artist: 'Linkin Park',
      album: 'Hybrid Theory',
      year: 2000
    });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('In the End');

    const deleteResponse = await request(app).delete('/api/tracks/1');
    expect(deleteResponse.status).toBe(204);

    const missingResponse = await request(app).get('/api/tracks/1');
    expect(missingResponse.status).toBe(404);
  });
});
