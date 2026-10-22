import test from 'node:test';
import assert from 'node:assert/strict';
import { placeBlock } from '../src/gameplay.js';
import { blockKey, createIsland, getBlock } from '../src/world.js';

const playerAwayFromTarget = { x: -3.5, y: 1, z: 3.5 };

test('placing a selected block on the targeted face adds one block and decrements inventory', () => {
  const world = createIsland();
  const result = placeBlock(world, blockKey(0, 0, 0), { x: 1, y: 0, z: 0 }, 'stone', { stone: 1 }, playerAwayFromTarget);

  assert.equal(result.placed, true);
  assert.equal(getBlock(world, 1, 0, 0), 'stone');
  assert.equal(result.inventory.stone, 0);
});

test('zero inventory cannot place a block', () => {
  const world = createIsland();
  const result = placeBlock(world, blockKey(0, 0, 0), { x: 1, y: 0, z: 0 }, 'stone', { stone: 0 }, playerAwayFromTarget);

  assert.equal(result.placed, false);
  assert.equal(result.reason, 'empty-inventory');
  assert.equal(getBlock(world, 1, 0, 0), undefined);
});

test('an occupied target face cannot be overwritten', () => {
  const world = createIsland();
  const result = placeBlock(world, blockKey(0, 0, 0), { x: 1, y: 0, z: 0 }, 'stone', { stone: 1 }, playerAwayFromTarget);

  assert.equal(result.placed, false);
  assert.equal(result.reason, 'occupied');
  assert.equal(result.inventory.stone, 1);
});

test('a block cannot be placed inside the player', () => {
  const world = createIsland();
  const playerBesideTarget = { x: 1.5, y: 0, z: 0.5 };
  const result = placeBlock(world, blockKey(0, 0, 0), { x: 1, y: 0, z: 0 }, 'stone', { stone: 1 }, playerBesideTarget);

  assert.equal(result.placed, false);
  assert.equal(result.reason, 'player-overlap');
});
