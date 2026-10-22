import test from 'node:test';
import assert from 'node:assert/strict';
import { advancePlayerVertical } from '../src/physics.js';
import { createIsland } from '../src/world.js';

function jumpHeightAfter(frameDelta, frameCount) {
  const world = createIsland();
  let position = { x: 0.5, y: 1, z: 0.5 };
  let velocityY = 6.2;
  let grounded = false;
  for (let frame = 0; frame < frameCount; frame += 1) {
    const result = advancePlayerVertical(world, position, velocityY, grounded, frameDelta);
    position = result.position;
    velocityY = result.velocityY;
    grounded = result.grounded;
  }
  return position.y;
}

test('jump height is stable across common frame rates instead of snapping backward', () => {
  const at30Fps = jumpHeightAfter(1 / 30, 6);
  const at60Fps = jumpHeightAfter(1 / 60, 12);

  assert.ok(at30Fps > 1.5);
  assert.ok(Math.abs(at30Fps - at60Fps) < 0.01);
});

test('a descending player stays airborne until their feet actually cross the floor', () => {
  const world = createIsland();
  let position = { x: 0.5, y: 1, z: 0.5 };
  let velocityY = 6.2;
  let grounded = false;

  for (let frame = 0; frame < 30; frame += 1) {
    const result = advancePlayerVertical(world, position, velocityY, grounded, 1 / 60);
    position = result.position;
    velocityY = result.velocityY;
    grounded = result.grounded;
  }

  assert.equal(grounded, false);
  assert.ok(position.y > 1.5);
});
