import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock, getWorldBounds, MAX_WORLD_SIZE } from '../src/world.js';

test('the island has an additional two-story house and a small outbuilding', () => {
  const world = createIsland();
  assert.equal(getBlock(world, -7, 0, 5), 'planks');
  assert.equal(getBlock(world, -9, 5, 5), 'planks');
  assert.equal(getBlock(world, -7, 7, 5), 'brick');
  assert.equal(getBlock(world, 2, 4, 8), 'brick');

  const bounds = getWorldBounds(world);
  assert.ok(bounds.width <= MAX_WORLD_SIZE);
  assert.ok(bounds.height <= MAX_WORLD_SIZE);
  assert.ok(bounds.depth <= MAX_WORLD_SIZE);
});

