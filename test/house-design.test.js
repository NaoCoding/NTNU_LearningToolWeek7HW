import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock } from '../src/world.js';

test('the main house has a larger footprint, detailed facade, and connected block staircase', () => {
  const world = createIsland();
  assert.equal(getBlock(world, -11, 0, 4), 'planks');
  assert.equal(getBlock(world, -3, 0, 4), 'planks');
  assert.equal(getBlock(world, -10, 2, 8), undefined);
  assert.equal(getBlock(world, -9, 5, 5), 'planks');

  for (let step = 0; step < 4; step += 1) {
    assert.equal(getBlock(world, -10 + step, 1 + step, 4), 'planks');
  }
});
