import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, stepUpPlayerOnStairs } from '../src/world.js';

test('the player can climb each staircase tread without jumping', () => {
  const world = createIsland();
  let position = { x: -6.5, y: 1, z: 8.5 };
  for (let step = 0; step < 4; step += 1) {
    const target = { x: position.x, y: position.y, z: position.z - 1 };
    position = stepUpPlayerOnStairs(world, position, target) ?? target;
    assert.equal(position.y, 2 + step);
  }
});

test('stair stepping does not let the player climb ordinary walls', () => {
  const world = createIsland();
  const position = { x: -11.5, y: 1, z: 4.5 };
  assert.equal(stepUpPlayerOnStairs(world, position, { x: -10.5, y: 1, z: 4.5 }), null);
});
