import test from 'node:test';
import assert from 'node:assert/strict';
import { worldLightLevelsAt } from '../src/lighting.js';

test('night lighting keeps the island clearly visible while daytime remains bright', () => {
  const night = worldLightLevelsAt(0.1);
  const day = worldLightLevelsAt(1);

  assert.ok(night.sunlight >= 0.8);
  assert.ok(night.sunlight < 0.95);
  assert.ok(night.hemisphere >= 0.8);
  assert.ok(night.hemisphere < 1);
  assert.equal(day.sunlight, 2);
  assert.equal(day.hemisphere, 2.1);
});

test('rain darkens the sky and reduces light levels', () => {
  const clear = worldLightLevelsAt(0.1);
  const rainy = worldLightLevelsAt(0.1, true);

  assert.ok(rainy.sunlight < clear.sunlight);
  assert.ok(rainy.hemisphere < clear.hemisphere);
  assert.ok(rainy.skyDarkness > clear.skyDarkness);
});
