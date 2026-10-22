import assert from 'node:assert/strict';
import test from 'node:test';
import { getAvatarFacing } from '../src/avatar-motion.js';

test('the body turns toward strafing movement while the head keeps following the cursor', () => {
  const facing = getAvatarFacing(
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 0, z: 0 },
  );

  assert.ok(Math.abs(facing.bodyYaw - Math.PI / 2) < 1e-6);
  assert.ok(Math.abs(facing.headYaw + Math.PI / 2) < 1e-6);
});

test('idle body faces the cursor with no compensating head turn', () => {
  const facing = getAvatarFacing({ x: 1, y: 0, z: 0 }, null);
  assert.ok(Math.abs(facing.bodyYaw - Math.PI / 2) < 1e-6);
  assert.equal(facing.headYaw, 0);
});

