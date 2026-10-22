import test from 'node:test';
import assert from 'node:assert/strict';
import { hasFallenIntoVoid } from '../src/gameplay.js';

test('falling below the void threshold is detected for respawn', () => {
  assert.equal(hasFallenIntoVoid({ y: -8 }), false);
  assert.equal(hasFallenIntoVoid({ y: -8.01 }), true);
});
