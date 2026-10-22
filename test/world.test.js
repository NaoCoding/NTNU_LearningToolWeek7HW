import test from 'node:test';
import assert from 'node:assert/strict';
import { createIsland, getBlock, getWorldBounds, MAX_WORLD_SIZE } from '../src/world.js';

test('creates a finite island no larger than the homework world limit', () => {
  const blocks = createIsland();
  const bounds = getWorldBounds(blocks);

  assert.ok(blocks.size > 0);
  assert.ok(bounds.width <= MAX_WORLD_SIZE);
  assert.ok(bounds.height <= MAX_WORLD_SIZE);
  assert.ok(bounds.depth <= MAX_WORLD_SIZE);
});

test('the island has a walkable grassy surface and solid earth below it', () => {
  const blocks = createIsland();

  assert.equal(getBlock(blocks, 0, 0, 0), 'grass');
  assert.equal(getBlock(blocks, 0, -1, 0), 'dirt');
  assert.equal(getBlock(blocks, 100, 0, 100), undefined);
});
