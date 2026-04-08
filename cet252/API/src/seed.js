const { initializeDb } = require('./db');

initializeDb()
  .then(() => {
    console.log('Database seed complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  });
