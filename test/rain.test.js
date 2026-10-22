import test from 'node:test';
import assert from 'node:assert/strict';
import { createRainParticle, isSheltered, toggleRain, updateRainParticles } from '../src/gameplay.js';
import { blockKey, createIsland } from '../src/world.js';

test('R toggles rain on and off', () => {
  assert.equal(toggleRain(false), true);
  assert.equal(toggleRain(true), false);
});

test('a solid roof shelters the player directly below it', () => {
  const world = createIsland();
  world.set(blockKey(0, 4, 0), 'planks');

  assert.equal(isSheltered(world, { x: 0.5, y: 1, z: 0.5 }), true);
  assert.equal(isSheltered(world, { x: 2.5, y: 1, z: 0.5 }), false);
});

test('rain does not spawn below a roof', () => {
  const world = createIsland();
  world.set(blockKey(0, 4, 0), 'planks');

  assert.equal(createRainParticle(world, 0.5, 8, 0.5), null);
  assert.ok(createRainParticle(world, 2.5, 8, 0.5));
});

test('rain moves down and is reset above a roof instead of passing through it', () => {
  const world = createIsland();
  world.set(blockKey(0, 4, 0), 'planks');
  const falling = updateRainParticles([{ x: 0.5, y: 4.2, z: 0.5, velocityY: -8 }], world, 0.05)[0];

  assert.equal(falling.y, 8);
  assert.ok(updateRainParticles([{ x: 20.5, y: 8, z: 20.5, velocityY: -8 }], world, 0.1)[0].y < 8);
});
