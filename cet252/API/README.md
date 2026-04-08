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
- `npm run seed` - initialize DB and ensure seeded records
- `npm run docs` - generate API docs into `../APIDOC`
- `npm run build:docs` - alias for docs generation

## Docs route

After running `npm run docs`, generated docs are available at:
- `http://localhost:3001/docs`

## Endpoints
- `GET /health`
- `GET /api/albums`
- `GET /api/albums/:id`
- `POST /api/albums`
- `PUT /api/albums/:id`
- `DELETE /api/albums/:id`
