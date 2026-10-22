# Sky Island — Week 7 homework

Student ID: 41247001S
Name: 盧昱安

A static Three.js voxel island built in small, test-driven stages for the Week 7 engineering workflow. Mine and collect blocks, place them from the numbered hotbar, press R for rain, and watch the 2-minute day/night cycle.

## Project documents

- `BRIEF.md` — goal, scope, and course constraints.
- `VERIFY.md` — acceptance checklist and manual gameplay checks.
- `PLANS.v1.md` — preserved initial plan draft.
- `PLANS.md` — current step-by-step implementation plan.
- `AGENTS.md` — working and TDD rules for this repository.

## Running

The browser app will be served as static files (no application backend). A local static file server is needed for ES modules; run `python3 -m http.server 8000` in the repository and open `http://localhost:8000`.

Run automated checks with `npm test`.
