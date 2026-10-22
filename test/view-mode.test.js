import assert from 'node:assert/strict';
import test from 'node:test';
import { togglePerspective } from '../src/view-mode.js';

test('perspective view can be toggled in both directions', () => {
  assert.equal(togglePerspective(false), true);
  assert.equal(togglePerspective(true), false);
});

