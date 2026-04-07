const statusElement = document.getElementById('status');
const rowsContainer = document.getElementById('trackRows');

const renderRows = (tracks) => {
  rowsContainer.innerHTML = '';

  for (const track of tracks) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${track.title}</td>
      <td>${track.artist}</td>
      <td>${track.album}</td>
      <td>${track.genre}</td>
      <td>${track.year}</td>
    `;
    rowsContainer.appendChild(row);
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
