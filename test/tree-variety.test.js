import test from 'node:test';
import assert from 'node:assert/strict';
import { blockKey, createIsland } from '../src/world.js';

test('the island has several tree silhouettes with differing trunk heights', () => {
  const world = createIsland();
  const trunks = [...world.keys()]
    .map((key) => key.split(',').map(Number))
    .filter(([x, y, z]) => y === 1 && world.get(blockKey(x, y, z)) === 'log');
  const heights = trunks.map(([x, , z]) => {
    let height = 0;
    while (world.get(blockKey(x, height + 1, z)) === 'log') height += 1;
    return height;
  });

  assert.ok(trunks.length >= 8);
  assert.ok(new Set(heights).size >= 2);
});
