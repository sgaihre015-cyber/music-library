const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const defaultDbPath = path.join(__dirname, '..', 'database', 'music-library.db');
const dbPath = process.env.DB_FILE || defaultDbPath;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new sqlite3.Database(dbPath);

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

const seedFilePath = path.join(__dirname, '..', 'database', 'seed-tracks.json');

const getSeedTracks = () => {
  const fileContent = fs.readFileSync(seedFilePath, 'utf8');
  const tracks = JSON.parse(fileContent);
  if (!Array.isArray(tracks) || tracks.length < 20) {
    throw new Error('Seed file must contain at least 20 tracks');
  }
  return tracks;
};

const initDb = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT NOT NULL,
      genre TEXT NOT NULL,
      year INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL
    )
  `);

  const countRow = await get('SELECT COUNT(*) AS count FROM tracks');
  if (!countRow || countRow.count < 20) {
    const seedTracks = getSeedTracks();
    await run('DELETE FROM tracks');
    for (const track of seedTracks) {
      // eslint-disable-next-line no-await-in-loop
      await run(
        `INSERT INTO tracks (title, artist, album, genre, year, duration_seconds)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          track.title,
          track.artist,
          track.album,
          track.genre,
          track.year,
          track.duration_seconds
        ]
      );
    }
  }
};

const closeDb = () =>
  new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

module.exports = {
  db,
  dbPath,
  run,
  get,
  all,
  initDb,
  closeDb
};
