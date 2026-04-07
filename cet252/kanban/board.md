# Kanban Board - Music Library Prototype

## To Do
- Prepare screencast with narration + webcam
- Export final zip package (`cet252.zip`)

## In Progress
- Final polish and walkthrough rehearsal

## Review
- Validate all tutor run paths (API docs, API start, client start, tests)

## Done
- Define user stories and acceptance criteria
- Build API CRUD endpoints with JSON responses
- Seed SQLite database with realistic records
- Add APIDOC comments and docs generation script
- Build high-fidelity client GET integration
- Add functional tests for success + error path
- Create lo-fi wireframe notes and Figma prototype checklist
- Keep incremental commit history

## User Stories and Acceptance Criteria
1. As a user, I can list albums so that I can browse the library.
   - GET `/api/albums` returns JSON array.
2. As a user, I can view one album so that I can inspect details.
   - GET `/api/albums/:id` returns JSON record or 404.
3. As a user, I can create an album so that I can add new music.
   - POST validates input and returns 201 JSON.
4. As a user, I can update an album so that data stays current.
   - PUT validates input and returns updated JSON.
5. As a user, I can delete an album so that I can remove outdated data.
   - DELETE returns JSON confirmation or 404.
