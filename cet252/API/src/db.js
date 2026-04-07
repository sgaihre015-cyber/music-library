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

const seedTracks = [
  ['Take Five', 'The Dave Brubeck Quartet', 'Time Out', 'Jazz', 1959, 324],
  ['So What', 'Miles Davis', 'Kind of Blue', 'Jazz', 1959, 545],
  ['Hysteria', 'Muse', 'Absolution', 'Alternative Rock', 2003, 227],
  ['Billie Jean', 'Michael Jackson', 'Thriller', 'Pop', 1982, 294],
  ['Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 'Rock', 1975, 355],
  ['Smells Like Teen Spirit', 'Nirvana', 'Nevermind', 'Grunge', 1991, 301],
  ['Hey Ya!', 'OutKast', 'Speakerboxxx/The Love Below', 'Hip-Hop', 2003, 236],
  ['Rolling in the Deep', 'Adele', '21', 'Soul', 2010, 229],
  ['Blinding Lights', 'The Weeknd', 'After Hours', 'Synthwave', 2019, 200],
  ['Levitating', 'Dua Lipa', 'Future Nostalgia', 'Pop', 2020, 203],
  ['Numb', 'Linkin Park', 'Meteora', 'Nu Metal', 2003, 186],
  ['Fix You', 'Coldplay', 'X&Y', 'Alternative Rock', 2005, 295],
  ['Shape of You', 'Ed Sheeran', '÷', 'Pop', 2017, 234],
  ['Lose Yourself', 'Eminem', '8 Mile', 'Hip-Hop', 2002, 326],
  ['Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'Uptown Special', 'Funk', 2014, 270],
  ['Halo', 'Beyoncé', 'I Am... Sasha Fierce', 'R&B', 2008, 261],
  ['Strobe', 'deadmau5', 'For Lack of a Better Name', 'Electronic', 2009, 631],
  ['Titanium', 'David Guetta ft. Sia', 'Nothing but the Beat', 'Dance', 2011, 245],
  ['Can\'t Hold Us', 'Macklemore & Ryan Lewis', 'The Heist', 'Hip-Hop', 2011, 258],
  ['Bad Guy', 'Billie Eilish', 'When We All Fall Asleep, Where Do We Go?', 'Electropop', 2019, 194]
];

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
    await run('DELETE FROM tracks');
    for (const track of seedTracks) {
      // eslint-disable-next-line no-await-in-loop
      await run(
        `INSERT INTO tracks (title, artist, album, genre, year, duration_seconds)
         VALUES (?, ?, ?, ?, ?, ?)`,
        track
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
