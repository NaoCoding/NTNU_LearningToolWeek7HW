import assert from 'node:assert/strict';
import test from 'node:test';
import { ANIMAL_MODELS } from '../src/animal-models.js';

test('the island has small voxel animals made from lightweight Three.js parts', () => {
  assert.equal(ANIMAL_MODELS.length, 12);
  assert.ok(ANIMAL_MODELS.some((animal) => animal.type === 'rabbit'));
  assert.ok(ANIMAL_MODELS.some((animal) => animal.type === 'chicken'));
  assert.ok(ANIMAL_MODELS.every((animal) => animal.parts.length >= 5));
  assert.equal(new Set(ANIMAL_MODELS.map((animal) => animal.position.join(','))).size, 12);
});

test('animals have shadows and the scene uses a low-resolution shadow map', async () => {
  const { SHADOW_MAP_SIZE } = await import('../src/visual-effects.js');
  assert.equal(SHADOW_MAP_SIZE, 512);
  assert.ok(ANIMAL_MODELS.every((animal) => animal.castShadow));
});
