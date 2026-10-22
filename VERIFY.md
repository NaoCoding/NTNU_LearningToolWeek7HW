# VERIFY: Sky Island

This file is the student-owned acceptance checklist. Keep the teacher-provided first batch intact. Add the student's second-batch cases only after choosing a feature.

## STEP 0 — Island and movement

- [ ] The island is a finite world no larger than 32 × 32 × 32 blocks.
- [ ] WASD moves the player and Space jumps.
- [ ] The player cannot walk through solid blocks or fall through the island.
- [ ] The fullscreen view renders smoothly at 30 fps or more on the target school computer.

## STEP 1 — Mine a block

- [ ] Hold the left mouse button to mine; cracks progress and the block disappears in less than 1 second for dirt.
- [ ] **Must not:** remove a block from a single quick click.
- [ ] Release halfway through mining; the crack disappears and mining restarts from the beginning.
- [ ] Mining stone takes longer than dirt, about 2 seconds.

## STEP 2 — Drop the mined block

- [ ] The removed block produces a small drop of the same type that slowly rotates and falls onto the island.
- [ ] **Must not:** leave the drop floating in the air or let it pass through the ground.

## STEP 3 — Collect a drop

- [ ] Walk close to a drop; it flies to the player and the matching hotbar count increases by 1.
- [ ] **Must not:** collect a drop while standing 3 blocks away.

## STEP 4 — Place a block

- [ ] Select a hotbar slot and right-click a valid neighboring face; one block is placed and its count decreases by 1.
- [ ] **Must not:** place a block when that slot has count 0.
- [ ] Play through the whole mine → drop → collect → place loop; inventory returns to its starting count.

## STEP 5 — Rain (student's idea)

- [ ] Press R; visible rain starts and raindrops move downward.
- [ ] Stand under a solid roof while rain is active; the player stays dry.
- [ ] **Must not:** let rain pass through the roof into the sheltered area.

## STEP 6 — Day/night cycle (student's idea)

- [ ] Let the cycle run; the sky and island lighting visibly change from day to night.
- [ ] Continue through a full cycle; daylight returns after night.
- [ ] **Must not:** change the world's block contents or inventory as the lighting changes.
