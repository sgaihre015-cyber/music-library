# Music Library API

## Requirements
- Node 20.10.0 LTS or newer

## Setup
1. Install dependencies: `npm install`
2. Start API server: `npm start`

API runs locally at `http://localhost:3001`.

## Available scripts
- `npm start` - run API server
- `npm run dev` - run API with nodemon
- `npm test` - run API tests
- `npm run docs` - generate API docs into `../APIDOC`

## Endpoints
- `GET /health`
- `GET /api/albums`
- `GET /api/albums/:id`
- `POST /api/albums`
- `PUT /api/albums/:id`
- `DELETE /api/albums/:id`
