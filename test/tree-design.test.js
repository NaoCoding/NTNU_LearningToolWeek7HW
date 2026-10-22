import assert from 'node:assert/strict';
import test from 'node:test';
import { TREE_PLACEMENTS, TREE_PROFILES } from '../src/trees.js';

test('island trees include taller trunks and varied broad and conical canopies', () => {
  assert.ok(TREE_PLACEMENTS.length >= 10);
  assert.ok(Math.max(...TREE_PROFILES.map((profile) => profile.trunk)) >= 8);

  const canopyShapes = new Set(TREE_PROFILES.map((profile) => profile.canopy.map(({ radius }) => radius).join(',')));
  assert.ok(canopyShapes.size >= 4);
});

