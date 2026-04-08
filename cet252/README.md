# CET252 Submission Structure

- `API/` - Express + SQLite API source, tests, package scripts, database
- `CLIENT/` - local client app, startup guide, functional tests
- `APIDOC/` - generated API documentation site
- `kanban/` - kanban board and user stories
- `design/` - low-fidelity wireframes and high-fidelity prototype notes

## Tutor execution root

Set your working directory to:

`./cet252` (after extracting the submission ZIP)

Then run commands from each component folder:

- API:
  - `cd API`
  - `npm install`
  - `npm run docs`
  - `npm start`
  - Docs URL: `http://localhost:3001/docs`
- Client (in another terminal):
  - `cd CLIENT`
  - `npm install`
  - `npm start`
  - Client URL: `http://127.0.0.1:4173`
- Functional tests:
  - `cd CLIENT`
  - `npm test`
