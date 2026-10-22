import assert from 'node:assert/strict';
import test from 'node:test';
import { PLAYER_MODEL_PARTS } from '../src/avatar.js';

test('the voxel player model includes a head, body, arms, hands, and legs', () => {
  const names = new Set(PLAYER_MODEL_PARTS.map((part) => part.name));
  for (const part of ['head', 'torso', 'left-arm', 'right-arm', 'left-hand', 'right-hand', 'left-leg', 'right-leg']) {
    assert.ok(names.has(part), `expected player model to include ${part}`);
  }
});

