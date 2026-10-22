import test from 'node:test';
import assert from 'node:assert/strict';
import { createIsland, getBlock } from '../src/world.js';

test('the island includes a cottage and a sand path built from course blocks', () => {
  const world = createIsland();

  assert.equal(getBlock(world, -2, 1, -3), 'planks');
  assert.equal(getBlock(world, 0, 4, -3), 'brick');
  assert.equal(getBlock(world, 0, 0, 4), 'sand');
});
