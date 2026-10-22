import { blockKey, getWorldBounds } from './world.js';

const MINING_TIMES = Object.freeze({
  dirt: 0.82,
  grass: 0.82,
  leaves: 0.5,
  log: 1.2,
  stone: 2.0,
});

export function miningDuration(blockType) {
  return MINING_TIMES[blockType] ?? 1.0;
}

export function beginMining(blockKey, blockType) {
  return { blockKey, blockType, elapsed: 0 };
}

export function advanceMining(session, deltaSeconds) {
  if (!session) return { session: null, progress: 0, complete: false };
  const elapsed = Math.max(0, session.elapsed + Math.max(0, deltaSeconds));
  const progress = Math.min(1, elapsed / miningDuration(session.blockType));
  return {
    session: { ...session, elapsed },
    progress,
    complete: progress >= 1,
  };
}

export function cancelMining() {
  return null;
}

let nextDropId = 1;
export function createDrop(minedBlockKey, blockType) {
  const [x, y, z] = minedBlockKey.split(',').map(Number);
  return {
    id: nextDropId++,
    type: blockType,
    x: x + 0.5,
    y: y + 0.62,
    z: z + 0.5,
    size: 0.28,
    velocityY: 1.8,
    rotation: 0,
    settled: false,
  };
}

export function updateDrops(drops, blocks, deltaSeconds) {
  const delta = Math.max(0, deltaSeconds);
  const bounds = getWorldBounds(blocks);
  return drops.map((drop) => {
    const next = { ...drop, rotation: drop.rotation + delta * 1.4 };
    if (drop.settled || delta === 0) return next;

    const previousBottom = drop.y - drop.size / 2;
    const velocityY = drop.velocityY - 9.8 * delta;
    const candidateY = drop.y + velocityY * delta;
    const blockX = Math.floor(drop.x);
    const blockZ = Math.floor(drop.z);
    let groundTop = null;
    for (let blockY = Math.floor(previousBottom - 1e-6); blockY >= bounds.minY; blockY -= 1) {
      if (blocks.has(blockKey(blockX, blockY, blockZ))) {
        groundTop = blockY + 1;
        break;
      }
    }

    const candidateBottom = candidateY - drop.size / 2;
    if (groundTop !== null && previousBottom >= groundTop - 1e-6 && candidateBottom <= groundTop) {
      return { ...next, y: groundTop + drop.size / 2, velocityY: 0, settled: true };
    }
    return { ...next, y: candidateY, velocityY };
  });
}

export function collectNearbyDrops(drops, position, inventory, radius = 1.6) {
  const nextInventory = { ...inventory };
  const remainingDrops = [];
  const collected = [];
  const radiusSquared = radius * radius;
  for (const drop of drops) {
    const dx = drop.x - position.x;
    const dy = drop.y - position.y;
    const dz = drop.z - position.z;
    if (dx * dx + dy * dy + dz * dz < radiusSquared) {
      nextInventory[drop.type] = (nextInventory[drop.type] ?? 0) + 1;
      collected.push(drop);
    } else remainingDrops.push(drop);
  }
  return { remainingDrops, inventory: nextInventory, collected };
}
