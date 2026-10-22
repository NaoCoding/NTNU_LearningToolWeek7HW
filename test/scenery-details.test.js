import assert from 'node:assert/strict';
import test from 'node:test';
import { SCENERY_DETAILS, WORLD_LANTERN_POSITIONS } from '../src/scenery-details.js';

test('Three.js scenery adds a custom roof shape and glowing lantern forms', () => {
  assert.ok(SCENERY_DETAILS.some((detail) => detail.shape === 'cone' && detail.texture === 'brick'));
  assert.ok(SCENERY_DETAILS.filter((detail) => detail.shape === 'octahedron' && detail.glow).length >= 2);
});

test('warm lantern posts are spread across the island', () => {
  assert.ok(WORLD_LANTERN_POSITIONS.length >= 8);
  const xValues = WORLD_LANTERN_POSITIONS.map(([x]) => x);
  const zValues = WORLD_LANTERN_POSITIONS.map(([, z]) => z);
  assert.ok(Math.max(...xValues) - Math.min(...xValues) >= 20);
  assert.ok(Math.max(...zValues) - Math.min(...zValues) >= 20);
  assert.equal(SCENERY_DETAILS.filter((detail) => detail.shape === 'post').length, WORLD_LANTERN_POSITIONS.length);
});
