const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');

const createDomWithMockedFetch = async (mockPayload, ok = true) => {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost:5173/'
  });

  dom.window.fetch = async () => ({
    ok,
    json: async () => mockPayload
  });

  dom.window.eval(script);

  await new Promise((resolve) => setTimeout(resolve, 0));
  return dom;
};

(async () => {
  const tracks = [
    { title: 'Test 1', artist: 'Artist 1', album: 'Album 1', genre: 'Pop', year: 2020 },
    { title: 'Test 2', artist: 'Artist 2', album: 'Album 2', genre: 'Rock', year: 2021 }
  ];

  const dom = await createDomWithMockedFetch(tracks, true);
  const rows = dom.window.document.querySelectorAll('#trackRows tr');
  const status = dom.window.document.getElementById('status').textContent;

  if (rows.length !== 2) {
    throw new Error(`Expected 2 rows but got ${rows.length}`);
  }

  if (!status.includes('Loaded 2 tracks')) {
    throw new Error(`Expected success status, got: ${status}`);
  }

  const failureDom = await createDomWithMockedFetch([], false);
  const failureStatus = failureDom.window.document.getElementById('status').textContent;

  if (!failureStatus.includes('Failed to load tracks')) {
    throw new Error(`Expected failure status, got: ${failureStatus}`);
  }

  // eslint-disable-next-line no-console
  console.log('Client functional tests passed');
})().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
