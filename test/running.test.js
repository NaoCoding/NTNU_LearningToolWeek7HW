import assert from 'node:assert/strict';
import test from 'node:test';
import { playerMovementSpeed } from '../src/physics.js';

test('holding run increases movement speed over the walking pace', () => {
  const walkingSpeed = playerMovementSpeed(false);
  const runningSpeed = playerMovementSpeed(true);
  assert.equal(walkingSpeed, 4.5);
  assert.ok(runningSpeed > walkingSpeed);
});

