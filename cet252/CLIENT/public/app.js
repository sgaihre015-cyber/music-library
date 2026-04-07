const statusElement = document.getElementById('status');
const rowsContainer = document.getElementById('trackRows');
const cardsContainer = document.getElementById('trackCards');

const renderRows = (tracks) => {
  rowsContainer.innerHTML = '';
  cardsContainer.innerHTML = '';

  for (const track of tracks) {
    const row = document.createElement('tr');
    const cells = [track.title, track.artist, track.album, track.genre, String(track.year)];
    for (const value of cells) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    }
    rowsContainer.appendChild(row);

    const card = document.createElement('article');
    card.className = 'track-card';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = '✅ Available';
    card.appendChild(badge);

    const title = document.createElement('h2');
    title.className = 'track-title';
    title.textContent = track.title;
    card.appendChild(title);

    const artist = document.createElement('p');
    artist.className = 'track-artist';
    artist.textContent = `by ${track.artist}`;
    card.appendChild(artist);

    const meta = document.createElement('p');
    meta.className = 'track-meta';
    meta.textContent = `${track.genre} • ${track.year} • ${track.album} • ${track.duration_seconds}s`;
    card.appendChild(meta);

    const summary = document.createElement('p');
    summary.className = 'track-summary';
    summary.textContent = `${track.title} is a ${track.genre.toLowerCase()} track by ${track.artist}.`;
    card.appendChild(summary);

    const actions = document.createElement('div');
    actions.className = 'track-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit';
    editBtn.type = 'button';
    editBtn.textContent = '✏ Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete';
    deleteBtn.type = 'button';
    deleteBtn.textContent = '🗑 Delete';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    card.appendChild(actions);

    cardsContainer.appendChild(card);
  }
};

const loadTracks = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/tracks');
    if (!response.ok) {
      throw new Error('Request failed');
    }

    const tracks = await response.json();
    renderRows(tracks);
    statusElement.textContent = `Loaded ${tracks.length} tracks from the API.`;
  } catch (error) {
    statusElement.textContent = 'Failed to load tracks. Is the API running on port 3000?';
  }
};

loadTracks();
