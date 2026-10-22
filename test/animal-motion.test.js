import assert from 'node:assert/strict';
import test from 'node:test';
import { canAnimalOccupy, createAnimalStates, getAnimalPose, updateAnimalMovement } from '../src/animal-motion.js';

function flatWorld(min = -4, max = 4) {
  const world = new Map();
  for (let z = min; z <= max; z += 1) {
    for (let x = min; x <= max; x += 1) world.set(`${x},0,${z}`, 'grass');
  }
  return world;
}

test('animals wander across open ground instead of only bobbing in place', () => {
  const world = flatWorld();
  const states = createAnimalStates([{ type: 'rabbit', position: [0.5, 1, 0.5], phase: 0 }]);
  const next = updateAnimalMovement(states, world, 2);
  assert.notDeepEqual([next[0].x, next[0].z], [0.5, 0.5]);
  assert.ok(canAnimalOccupy(world, next[0]));
});

test('animals steer around walls and keep away from each other', () => {
  const world = flatWorld();
  for (let y = 1; y <= 2; y += 1) {
    for (let z = -4; z <= 4; z += 1) world.set(`1,${y},${z}`, 'brick');
  }
  const states = createAnimalStates([
    { type: 'rabbit', position: [0.5, 1, 0.5], phase: 0 },
    { type: 'chicken', position: [0.5, 1, 2], phase: Math.PI },
  ]);
  states[0].heading = 0;
  states[0].turnTimer = 10;
  const next = updateAnimalMovement(states, world, 1);
  assert.ok(canAnimalOccupy(world, next[0]));
  assert.notEqual(next[0].z, 0.5);
  assert.ok(Math.hypot(next[0].x - next[1].x, next[0].z - next[1].z) >= 0.62);
});

test('animals do not walk off unsupported island edges', () => {
  const world = flatWorld(-1, 1);
  const states = createAnimalStates([{ type: 'rabbit', position: [1.5, 1, 0.5], phase: 0 }]);
  states[0].heading = 0;
  states[0].turnTimer = 10;
  const next = updateAnimalMovement(states, world, 2);
  assert.ok(canAnimalOccupy(world, next[0]));
  assert.ok(next[0].x < 1.8);
});

test('moving rabbits hop and both animals animate their legs', () => {
  const rabbitPose = getAnimalPose({ type: 'rabbit', moving: true, phase: 0 }, Math.PI / 18);
  const chickenPose = getAnimalPose({ type: 'chicken', moving: true, phase: 0 }, Math.PI / 18);
  assert.ok(rabbitPose.hopY > 0);
  assert.equal(chickenPose.hopY, 0);
  assert.notEqual(rabbitPose.leftLegX, 0);
  assert.notEqual(rabbitPose.rightLegX, 0);
  assert.notEqual(chickenPose.leftLegX, 0);
  assert.notEqual(chickenPose.rightLegX, 0);
  assert.deepEqual(getAnimalPose({ type: 'rabbit', moving: false, phase: 0 }, 1), {
    hopY: 0, leftLegX: 0, rightLegX: 0,
  });
});
