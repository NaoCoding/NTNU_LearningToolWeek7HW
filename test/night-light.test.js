import test from 'node:test';
import assert from 'node:assert/strict';
import { worldLightLevelsAt } from '../src/gameplay.js';

test('night lighting keeps the island clearly visible while daytime remains bright', () => {
  const night = worldLightLevelsAt(0.1);
  const day = worldLightLevelsAt(1);

  assert.ok(night.sunlight >= 0.9);
  assert.ok(night.hemisphere >= 1);
  assert.equal(day.sunlight, 2);
  assert.equal(day.hemisphere, 2.1);
});
