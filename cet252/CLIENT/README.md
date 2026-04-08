# Music Library Client

## Start locally

1. Start API first (from `../API`):
   - `npm install`
   - `npm run docs`
   - `npm start`
2. In this `CLIENT` folder:
   - `npm install`
   - `npm start`

The client runs at `http://127.0.0.1:4173` and reads data from `http://localhost:3001/api/albums`.

## Functional tests

- `npm test`

The test runner installs client/API dependencies, installs Chromium (if needed), then starts both API and client servers automatically.
