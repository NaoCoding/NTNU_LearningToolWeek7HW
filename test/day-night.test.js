import test from 'node:test';
import assert from 'node:assert/strict';
import { daylightAt } from '../src/gameplay.js';

test('the cycle starts in daylight and reaches night halfway through', () => {
  assert.equal(daylightAt(0, 120), 1);
  assert.ok(daylightAt(60, 120) < 0.2);
});

test('daylight returns after one complete cycle', () => {
  assert.equal(daylightAt(120, 120), daylightAt(0, 120));
  assert.equal(daylightAt(130, 120), daylightAt(10, 120));
});

test('the cycle handles long and negative elapsed times without invalid values', () => {
  for (const time of [-300, -1, 0, 23, 60, 9000]) {
    const level = daylightAt(time, 120);
    assert.ok(Number.isFinite(level));
    assert.ok(level >= 0.1 && level <= 1);
  }
});
