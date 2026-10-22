import test from 'node:test';
import assert from 'node:assert/strict';
import { collectNearbyDrops, createDrop } from '../src/gameplay.js';

test('walking beside a drop collects it and increments the matching type', () => {
  const drop = createDrop('0,0,0', 'stone');
  const result = collectNearbyDrops([drop], { x: 0.5, y: 0.5, z: 1.5 }, { stone: 2 });

  assert.equal(result.remainingDrops.length, 0);
  assert.equal(result.inventory.stone, 3);
  assert.equal(result.collected[0].id, drop.id);
});

test('a drop three blocks away is not collected', () => {
  const drop = createDrop('3,0,0', 'dirt');
  const result = collectNearbyDrops([drop], { x: 0.5, y: 0.5, z: 0.5 }, { dirt: 0 });

  assert.equal(result.remainingDrops.length, 1);
  assert.equal(result.inventory.dirt, 0);
});

test('collecting several drops counts each matching block type separately', () => {
  const drops = [createDrop('0,0,0', 'dirt'), createDrop('1,0,0', 'log')];
  const result = collectNearbyDrops(drops, { x: 1, y: 0.5, z: 0.5 }, { dirt: 0, log: 1 });

  assert.deepEqual(result.inventory, { dirt: 1, log: 2 });
  assert.equal(result.remainingDrops.length, 0);
});
