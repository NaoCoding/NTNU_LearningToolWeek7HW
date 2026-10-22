import { blockKey, canOccupyPlayer, PLAYER_RADIUS } from './world.js';

function supportAt(blocks, position, minTop, maxTop) {
  let supportY = null;
  const minX = Math.floor(position.x - PLAYER_RADIUS);
  const maxX = Math.floor(position.x + PLAYER_RADIUS - 1e-6);
  const minZ = Math.floor(position.z - PLAYER_RADIUS);
  const maxZ = Math.floor(position.z + PLAYER_RADIUS - 1e-6);
  for (let z = minZ; z <= maxZ; z += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = Math.floor(minTop - 1); y <= Math.floor(maxTop - 1e-6); y += 1) {
        if (blocks.has(blockKey(x, y, z))) supportY = Math.max(supportY ?? -Infinity, y + 1);
      }
    }
  }
  return supportY;
}

export function advancePlayerVertical(blocks, position, velocityY, grounded, deltaSeconds) {
  let remaining = Math.max(0, deltaSeconds);
  let result = { position: { ...position }, velocityY, grounded };
  const substep = 1 / 120;
  while (remaining > 1e-8) {
    const delta = Math.min(substep, remaining);
    const currentSupport = supportAt(blocks, result.position, result.position.y - 0.04, result.position.y + 0.04);
    if (result.grounded && result.velocityY <= 0 && currentSupport !== null) {
      result = { position: { ...result.position, y: currentSupport }, velocityY: 0, grounded: true };
    } else {
      const nextVelocityY = result.velocityY - 18 * delta;
      const nextY = result.position.y + nextVelocityY * delta;
      if (nextVelocityY <= 0) {
        const landingY = supportAt(blocks, result.position, nextY - 1e-6, result.position.y + 1e-6);
        if (landingY !== null) {
          result = { position: { ...result.position, y: landingY }, velocityY: 0, grounded: true };
        } else {
          const candidate = { ...result.position, y: nextY };
          if (canOccupyPlayer(blocks, candidate)) result = { position: candidate, velocityY: nextVelocityY, grounded: false };
          else result = { position: { ...result.position }, velocityY: 0, grounded: currentSupport !== null };
        }
      } else {
        const candidate = { ...result.position, y: nextY };
        if (canOccupyPlayer(blocks, candidate)) result = { position: candidate, velocityY: nextVelocityY, grounded: false };
        else result = { position: { ...result.position }, velocityY: 0, grounded: currentSupport !== null };
      }
    }
    remaining -= delta;
  }
  return result;
}
