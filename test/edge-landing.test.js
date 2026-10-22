import test from 'node:test';
import assert from 'node:assert/strict';
import { advancePlayerVertical } from '../src/physics.js';
import { createIsland } from '../src/world.js';

test('vertical movement stays grounded at the island edge without alternating between falling and landing', () => {
  const world = createIsland();
  let player = { x: 13.5, y: 1, z: 0.5 };
  let velocityY = 0;
  let grounded = true;

  for (let frame = 0; frame < 30; frame += 1) {
    const next = advancePlayerVertical(world, player, velocityY, grounded, 1 / 60);
    player = next.position;
    velocityY = next.velocityY;
    grounded = next.grounded;
    assert.equal(grounded, true);
    assert.equal(player.y, 1);
  }
});
