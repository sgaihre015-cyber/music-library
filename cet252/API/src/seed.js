const { initDb, closeDb, dbPath } = require('./db');

initDb()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log(`Database seeded/verified at ${dbPath}`);
    await closeDb();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to seed database:', error);
    try {
      await closeDb();
    } catch (_closeError) {
      // noop
    }
    process.exit(1);
  });
