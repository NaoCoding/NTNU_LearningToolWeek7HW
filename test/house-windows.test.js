import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock } from '../src/world.js';
import { SCENERY_DETAILS } from '../src/scenery-details.js';

test('the main house has open window bays with glass on both floors', () => {
  const world = createIsland();
  assert.equal(getBlock(world, -10, 2, 8), undefined);
  assert.equal(getBlock(world, -9, 6, 8), undefined);
  assert.ok(SCENERY_DETAILS.filter((detail) => detail.shape === 'glass').length >= 8);
});
