# Music Library Client

## Start locally

1. Install dependencies:
   - `npm install`
2. Start the client app:
   - `npm start`
3. In a separate terminal, start the API:
   - `npm --prefix ../API start`

The client runs at `http://127.0.0.1:4173` and reads data from `http://localhost:3001/api/albums`.

## Features

- Search albums by title/artist
- Filter albums by genre
- Add, edit and delete albums using API CRUD endpoints
- Responsive card-based UI (Book Manager-style layout adapted for Music Library)

## Functional tests

- `npm test`

The test runner installs client/API dependencies, installs Chromium (if needed), then starts both API and client servers automatically.
