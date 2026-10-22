import test from 'node:test';
import assert from 'node:assert/strict';
import { canOccupyPlayer, createIsland } from '../src/world.js';

test('a player can occupy open air above the island', () => {
  assert.equal(canOccupyPlayer(createIsland(), { x: 0.5, y: 1, z: 0.5 }), true);
});

test('a player cannot move into a solid block', () => {
  assert.equal(canOccupyPlayer(createIsland(), { x: 0.5, y: 0, z: 0.5 }), false);
});

test('the player must remain inside the finite island play area', () => {
  assert.equal(canOccupyPlayer(createIsland(), { x: 100, y: 1, z: 100 }), false);
});
