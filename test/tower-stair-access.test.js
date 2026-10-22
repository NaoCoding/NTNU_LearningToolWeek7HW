import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock, stepUpPlayerOnStairs } from '../src/world.js';

test('the cottage tower has an uninterrupted stair route from ground to its roof', () => {
  const world = createIsland();
  let position = { x: 10.5, y: 1, z: -9.5 };
  for (let step = 0; step < 6; step += 1) {
    const target = { x: position.x, y: position.y, z: position.z + 1 };
    position = stepUpPlayerOnStairs(world, position, target) ?? target;
    assert.equal(position.y, 2 + step);
  }
  assert.equal(getBlock(world, 9, 6, -3), 'stone');
  assert.equal(position.y, 7);
});
