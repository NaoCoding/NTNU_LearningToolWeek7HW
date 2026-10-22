import assert from 'node:assert/strict';
import test from 'node:test';
import { createIsland, getBlock, getWorldBounds, MAX_WORLD_SIZE } from '../src/world.js';

test('the island has a rounded irregular shoreline with sand beaches and exposed rock', () => {
  const world = createIsland();
  const surfaceTypes = new Set([...world.entries()].filter(([key]) => key.split(',')[1] === '0').map(([, type]) => type));

  assert.equal(getBlock(world, 13, 0, 13), undefined);
  assert.ok(getBlock(world, 0, 0, 13));
  assert.ok(surfaceTypes.has('sand'));
  assert.ok(surfaceTypes.has('stone'));
  assert.ok([...world.entries()].some(([key, type]) => key.split(',')[1] === '-1' && type === 'stone'));

  const bounds = getWorldBounds(world);
  assert.ok(bounds.width <= MAX_WORLD_SIZE);
  assert.ok(bounds.height <= MAX_WORLD_SIZE);
  assert.ok(bounds.depth <= MAX_WORLD_SIZE);
});

