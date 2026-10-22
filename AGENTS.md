# Project instructions

- Do not read or copy source code from the reference website. Build this project independently from the homework requirements and the supplied `sky-island-assets/` pack.
- Do not change `VERIFY.md` while implementing a planned step. The student owns its acceptance criteria. If a case appears wrong or incomplete, explain the concern and ask before editing it.
- You may adjust `PLANS.md` as implementation details become clear. Report each adjustment and do not add work outside `BRIEF.md`.
- Work on one plan step at a time. Stop after that step and report what changed, which checks ran, and their results.
- Use TDD for every step: write that step's tests, run them and confirm the new tests fail for the expected reason, then commit the tests before writing implementation. Run the complete test suite; commit implementation only when every test passes, then mark the step complete in `PLANS.md`.
- Never change tests just to make them pass. If a test needs to change, explain why and ask first.

## Project conventions

- Keep the game a static HTML/CSS/JavaScript site using Three.js. Do not add a backend, account system, game engine, multiplayer, or an infinite world.
- Keep the world within 32 × 32 × 32 blocks and target at least 30 frames per second on school computers with integrated graphics or CPU-only rendering.
- Use only the supplied course asset pack for block textures, icons, and mining cracks. Preserve crisp pixel art with nearest-neighbor texture filtering.
- Keep gameplay rules and persistence logic independent of rendering where practical so they can be covered by automated tests.
- Use `npm test` to run the automated test suite. Do not add dependencies without a clear need.
