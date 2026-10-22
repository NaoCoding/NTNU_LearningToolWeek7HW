import assert from 'node:assert/strict';
import test from 'node:test';
import { SCENERY_DETAILS } from '../src/scenery-details.js';

test('Three.js scenery adds a custom roof shape and glowing lantern forms', () => {
  assert.ok(SCENERY_DETAILS.some((detail) => detail.shape === 'cone' && detail.texture === 'brick'));
  assert.ok(SCENERY_DETAILS.filter((detail) => detail.shape === 'octahedron' && detail.glow).length >= 2);
});

