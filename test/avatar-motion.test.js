import assert from 'node:assert/strict';
import test from 'node:test';
import { getAvatarMotion, getThirdPersonCameraPose } from '../src/avatar-motion.js';

test('walking animates legs and first-person hand while idle limbs stay still', () => {
  const walking = getAvatarMotion(0.2, true, false, true, 0);
  const idle = getAvatarMotion(0.2, false, false, true, 0);
  assert.notEqual(walking.leftLegX, 0);
  assert.equal(walking.leftLegX, -walking.rightLegX);
  assert.notEqual(walking.handY, 0);
  assert.equal(idle.leftLegX, 0);
  assert.equal(idle.handY, 0);
});

test('third-person camera position and head pitch follow the look direction', () => {
  const look = { x: 0, y: Math.SQRT1_2, z: -Math.SQRT1_2 };
  const pose = getThirdPersonCameraPose({ x: 1, y: 2, z: 3 }, look);
  const motion = getAvatarMotion(0, false, false, true, look.y);
  assert.ok(pose.position.y < 2);
  assert.ok(pose.position.z > 3);
  assert.ok(motion.headPitch > 0);
});

