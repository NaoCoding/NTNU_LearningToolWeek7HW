import assert from 'node:assert/strict';
import test from 'node:test';
import { LANTERN_LIGHT_DISTANCE, lanternIntensityAt } from '../src/visual-effects.js';

test('lanterns cast stronger light farther into the nearby world', () => {
  assert.ok(LANTERN_LIGHT_DISTANCE > 6);
  assert.ok(lanternIntensityAt(1) > 2.8);
  assert.ok(lanternIntensityAt(0.5) > 1.4);
  assert.equal(lanternIntensityAt(0), 0);
});
