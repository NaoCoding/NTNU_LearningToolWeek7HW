import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock } from '../src/world.js';

test('the main house has a ground-floor doorway on both opposite sides', () => {
  const world = createIsland();
  for (const z of [0, 8]) {
    assert.equal(getBlock(world, -7, 1, z), undefined);
    assert.equal(getBlock(world, -6, 2, z), undefined);
  }
});
