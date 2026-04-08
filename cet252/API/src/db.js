const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'music.db');
const db = new sqlite3.Database(dbPath);

const seedAlbums = [
  ['Midnight Signals', 'Aurora Drive', 'Synthwave', 2020, 12],
  ['Echoes of Rain', 'Luna Harbor', 'Indie Pop', 2021, 10],
  ['Concrete Dreams', 'North Avenue', 'Alt Rock', 2019, 11],
  ['Golden Hours', 'Sierra Bloom', 'Folk', 2018, 9],
  ['Neon Skies', 'Static Youth', 'Electronic', 2022, 13],
  ['Afterlight', 'Velvet Circuit', 'R&B', 2023, 8],
  ['Blue Thread', 'Harper Lane', 'Singer-Songwriter', 2017, 10],
  ['Night Transit', 'Metro Ghost', 'Hip-Hop', 2021, 14],
  ['Open Sea', 'Driftline', 'Ambient', 2016, 7],
  ['Wild Bloom', 'Juniper Vale', 'Country', 2020, 12],
  ['Parallel Hearts', 'Paper Satellites', 'Pop Rock', 2019, 11],
  ['Low Tide', 'Coastline Club', 'Lo-fi', 2024, 15],
  ['Signal Fade', 'Polar Static', 'Post Punk', 2018, 9],
  ['City Lines', 'The Eastbound', 'Jazz', 2015, 10],
  ['Refractions', 'Prism Atlas', 'Progressive Rock', 2022, 8],
  ['Sunset Protocol', 'Binary Coast', 'Dance', 2023, 12],
  ['Quiet Voltage', 'Nocturne Unit', 'Dream Pop', 2020, 9],
  ['Glass Roads', 'The Lanterns', 'Alternative', 2017, 11],
  ['Fire & Salt', 'Cedar Hill', 'Acoustic', 2016, 10],
  ['Silver Frame', 'Northern Frame', 'Classical Crossover', 2021, 6]
];

function initializeDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS albums (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          artist TEXT NOT NULL,
          genre TEXT NOT NULL,
          year INTEGER NOT NULL,
          tracks INTEGER NOT NULL
        )`,
        (createErr) => {
          if (createErr) return reject(createErr);

          db.get('SELECT COUNT(*) AS count FROM albums', (countErr, row) => {
            if (countErr) return reject(countErr);
            if (row.count >= 20) return resolve();

            const stmt = db.prepare(
              'INSERT INTO albums (title, artist, genre, year, tracks) VALUES (?, ?, ?, ?, ?)'
            );

            seedAlbums.forEach((album) => stmt.run(album));
            stmt.finalize((finalizeErr) => {
              if (finalizeErr) return reject(finalizeErr);
              resolve();
            });
          });
        }
      );
    });
  });
}

module.exports = {
  db,
  initializeDb
};
