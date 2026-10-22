import assert from 'node:assert/strict';
import test from 'node:test';
import { consumeJumpRequest } from '../src/player-input.js';

test('a held jump key is consumed once and does not auto-jump again after landing', () => {
  const firstJump = consumeJumpRequest(true, true);
  assert.deepEqual(firstJump, { shouldJump: true, pending: false });

  const afterLandingWhileStillHeld = consumeJumpRequest(firstJump.pending, true);
  assert.deepEqual(afterLandingWhileStillHeld, { shouldJump: false, pending: false });
});

test('a jump pressed in the air stays buffered until the player lands', () => {
  assert.deepEqual(consumeJumpRequest(true, false), { shouldJump: false, pending: true });
  assert.deepEqual(consumeJumpRequest(true, true), { shouldJump: true, pending: false });
});

