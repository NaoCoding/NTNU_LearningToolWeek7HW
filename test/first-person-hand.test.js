import assert from 'node:assert/strict';
import test from 'node:test';
import { FIRST_PERSON_HAND_ORIGIN, FIRST_PERSON_HAND_PARTS } from '../src/avatar.js';

test('the first-person hand is a compact view model placed in the lower-right corner', () => {
  assert.ok(FIRST_PERSON_HAND_ORIGIN[0] > 0.3);
  assert.ok(FIRST_PERSON_HAND_ORIGIN[1] < -0.1);
  assert.ok(FIRST_PERSON_HAND_ORIGIN[2] < -0.6);
  assert.ok(FIRST_PERSON_HAND_PARTS.every((part) => part.size[0] <= 0.16 && part.size[1] <= 0.3));
});

