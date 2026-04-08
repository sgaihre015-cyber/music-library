const API_BASE = (window.API_BASE || 'http://localhost:3001').replace(/\/$/, '');
const statusEl = document.getElementById('status');
const gridEl = document.getElementById('albumGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const genreFilter = document.getElementById('genreFilter');
const addNewBtn = document.getElementById('addNewBtn');
const formSection = document.getElementById('formSection');
const formTitle = document.getElementById('formTitle');
const albumForm = document.getElementById('albumForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');
const genreInput = document.getElementById('genreInput');
const yearInput = document.getElementById('yearInput');
const tracksInput = document.getElementById('tracksInput');

let allAlbums = [];
let editingId = null;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAlbums(albums) {
  if (!albums.length) {
    gridEl.innerHTML = '<p class="empty">No albums found.</p>';
    return;
  }

  gridEl.innerHTML = albums
    .map(
      (album) => `
      <article class="card" data-testid="album-card">
        <span class="badge">✓ Available</span>
        <h3>${escapeHtml(album.title)}</h3>
        <p class="meta">by ${escapeHtml(album.artist)}</p>
        <p class="sub">${escapeHtml(album.genre)} • ${album.year} • ${album.tracks} tracks</p>
        <div class="card-actions">
          <button class="btn btn-edit" data-action="edit" data-id="${album.id}">✎ Edit</button>
          <button class="btn btn-delete" data-action="delete" data-id="${album.id}">🗑 Delete</button>
        </div>
      </article>
    `
    )
    .join('');
}

function populateGenreFilter(albums) {
  const previous = genreFilter.value;
  const genres = [...new Set(albums.map((album) => album.genre).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  genreFilter.innerHTML = '<option value="all">All Genres</option>' +
    genres.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`).join('');
  genreFilter.value = genres.includes(previous) ? previous : 'all';
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;
  const filtered = allAlbums.filter((album) => {
    const matchesSearch =
      !query ||
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query);
    const matchesGenre = selectedGenre === 'all' || album.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  renderAlbums(filtered);
  statusEl.textContent = `Showing ${filtered.length} of ${allAlbums.length} albums`;
}

function resetForm() {
  editingId = null;
  formTitle.textContent = 'Add Album';
  albumForm.reset();
}

function toggleForm(visible) {
  formSection.classList.toggle('hidden', !visible);
}

async function fetchJson(endpoint, options) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Request failed with status ${response.status}`);
  }
  return result;
}

async function loadAlbums(endpoint = '/api/albums') {
  statusEl.textContent = 'Loading albums...';
  try {
    const result = await fetchJson(endpoint);
    allAlbums = Array.isArray(result.data) ? result.data : [];
    populateGenreFilter(allAlbums);
    applyFilters();
  } catch (error) {
    allAlbums = [];
    gridEl.innerHTML = '';
    statusEl.textContent = `Error: ${error.message}`;
  }
}

searchBtn.addEventListener('click', () => {
  applyFilters();
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  genreFilter.value = 'all';
  applyFilters();
});

genreFilter.addEventListener('change', applyFilters);

addNewBtn.addEventListener('click', () => {
  resetForm();
  toggleForm(true);
});

cancelEditBtn.addEventListener('click', () => {
  resetForm();
  toggleForm(false);
});

albumForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    title: titleInput.value.trim(),
    artist: artistInput.value.trim(),
    genre: genreInput.value.trim(),
    year: Number(yearInput.value),
    tracks: Number(tracksInput.value)
  };

  statusEl.textContent = editingId ? 'Updating album...' : 'Creating album...';

  try {
    if (editingId) {
      await fetchJson(`/api/albums/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await fetchJson('/api/albums', { method: 'POST', body: JSON.stringify(payload) });
    }
    resetForm();
    toggleForm(false);
    await loadAlbums();
  } catch (error) {
    statusEl.textContent = `Error: ${error.message}`;
  }
});

gridEl.addEventListener('click', async (event) => {
  const target = event.target.closest('button[data-action]');
  if (!target) return;

  const action = target.getAttribute('data-action');
  const id = Number(target.getAttribute('data-id'));
  if (!Number.isInteger(id)) return;

  if (action === 'edit') {
    const album = allAlbums.find((item) => item.id === id);
    if (!album) return;
    editingId = id;
    formTitle.textContent = 'Edit Album';
    titleInput.value = album.title;
    artistInput.value = album.artist;
    genreInput.value = album.genre;
    yearInput.value = album.year;
    tracksInput.value = album.tracks;
    toggleForm(true);
    return;
  }

  if (action === 'delete') {
    try {
      statusEl.textContent = 'Deleting album...';
      await fetchJson(`/api/albums/${id}`, { method: 'DELETE' });
      await loadAlbums();
    } catch (error) {
      statusEl.textContent = `Error: ${error.message}`;
    }
  }
});

loadAlbums();
