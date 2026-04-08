# Kanban Board - Music Library Prototype

## To Do
- Prepare screencast with narration + webcam
- Export final zip package (`cet252.zip`) after screencast capture

## In Progress
- Final walkthrough rehearsal and submission checks

## Review
- Verify final tutor evidence bundle (video + figma link + zip upload)

## Done
- Define user stories and acceptance criteria
- Build API CRUD endpoints with JSON responses
- Seed SQLite database with realistic records
- Add APIDOC comments and docs generation script
- Serve generated docs from API at `GET /docs` for localhost tutor access
- Build high-fidelity client GET integration
- Add functional tests for success + error path
- Create lo-fi wireframe notes and Figma prototype checklist
- Confirm tutor execution root and startup/test instructions in README files
- Keep incremental commit history

## Submission Evidence Checklist
- [x] CRUD API endpoints (GET/POST/PUT/DELETE) returning JSON
- [x] SQLite data set with 20+ realistic records
- [x] API documentation generation and localhost docs route
- [x] Client GET integration against local API
- [x] Functional test suite (Playwright)
- [ ] Final screencast with narration + webcam
- [ ] Final Figma link pasted in `design/high-fidelity-figma-prototype.md`
- [ ] Final zip export and upload

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
