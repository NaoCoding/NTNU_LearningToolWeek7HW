import test from 'node:test';
import assert from 'node:assert/strict';
import { createDrop, updateDrops } from '../src/gameplay.js';
import { createIsland, blockKey } from '../src/world.js';

test('a mined block creates a small drop of the same type at its location', () => {
  const drop = createDrop(blockKey(2, 0, -1), 'stone');

  assert.equal(drop.type, 'stone');
  assert.equal(drop.x, 2.5);
  assert.equal(drop.z, -0.5);
  assert.ok(drop.size < 0.5);
});

test('drops fall and slowly rotate over time', () => {
  const drop = createDrop(blockKey(0, 0, 0), 'dirt');
  const next = updateDrops([drop], createIsland(), 0.5)[0];

  assert.ok(next.rotation > 0);
  assert.ok(next.velocityY < drop.velocityY);
});

test('a drop settles on the block below instead of passing through the ground', () => {
  const world = createIsland();
  world.delete(blockKey(0, 0, 0));
  let [drop] = [createDrop(blockKey(0, 0, 0), 'grass')];
  for (let frame = 0; frame < 180; frame += 1) {
    [drop] = updateDrops([drop], world, 1 / 60);
  }

  assert.equal(drop.settled, true);
  assert.ok(drop.y - drop.size / 2 >= 0);
  assert.ok(Math.abs(drop.y - drop.size / 2) < 0.01);
});
