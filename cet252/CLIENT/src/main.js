const API_BASE = (window.API_BASE || 'http://localhost:3001').replace(/\/$/, '');
const statusEl = document.getElementById('status');
const gridEl = document.getElementById('albumGrid');
const reloadBtn = document.getElementById('reloadBtn');
const simulateErrorBtn = document.getElementById('simulateErrorBtn');

function renderAlbums(albums) {
  if (!albums.length) {
    gridEl.innerHTML = '<p>No albums found.</p>';
    return;
  }

  gridEl.innerHTML = albums
    .map(
      (album) => `
      <article class="card" data-testid="album-card">
        <h3>${album.title}</h3>
        <p><strong>Artist:</strong> ${album.artist}</p>
        <p><strong>Genre:</strong> ${album.genre}</p>
        <p><strong>Year:</strong> ${album.year}</p>
        <p><strong>Tracks:</strong> ${album.tracks}</p>
      </article>
    `
    )
    .join('');
}

async function loadAlbums(endpoint = '/api/albums') {
  statusEl.textContent = 'Loading albums...';
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    const albums = Array.isArray(result.data) ? result.data : [];
    renderAlbums(albums);
    statusEl.textContent = `Loaded ${albums.length} albums`;
  } catch (error) {
    gridEl.innerHTML = '';
    statusEl.textContent = `Error: ${error.message}`;
  }
}

reloadBtn.addEventListener('click', () => {
  loadAlbums('/api/albums');
});

simulateErrorBtn.addEventListener('click', () => {
  loadAlbums('/api/non-existent');
});

loadAlbums();
