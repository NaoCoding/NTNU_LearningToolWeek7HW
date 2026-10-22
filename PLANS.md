# PLANS

One step at a time. For each step, write tests, run them red, commit the tests, implement, run the complete test suite, then commit the green implementation. Stop and report after each step.

- [x] **Step 0 — Island and movement.** Establish the static Three.js page and test runner; create a small bounded island and player movement/collision. Verify: STEP 0. Automated checks pass; browser preview shows the island scene and start HUD.
- [x] **Step 1 — Mining.** Add hold-to-mine timing, crack feedback, cancellation on release, and slower stone mining. Verify: STEP 1. Four mining tests and the full suite pass.
- [x] **Step 2 — Drops.** Spawn same-type drops and make them settle on the island. Verify: STEP 2. Three drop tests and the full suite pass.
- [x] **Step 3 — Collection.** Collect only within range and add the matching inventory count. Verify: STEP 3. Three collection tests and the full suite pass.
- [x] **Step 4 — Placement.** Place a selected block on a valid neighboring face, reject zero inventory, and decrement the count. Verify: STEP 4. Four placement tests and the full suite pass. The success and player-overlap cases target open space above the island.
- [ ] **Step 5 — Rain.** Press R to toggle visible falling drops; shelter the player under the roof and keep rain out. Verify: STEP 5.
- [ ] **Step 6 — Day/night.** Transition sky and world lighting through day and night, then repeat without changing world or inventory state. Verify: STEP 6.

## Plan changes

None yet.
