import { addCottage } from './cottage.js';
import { addTrees } from './trees.js';

export const MAX_WORLD_SIZE = 32;
export const PLAYER_RADIUS = 0.28;
export const PLAYER_HEIGHT = 1.65;
const boundsCache = new WeakMap();

export function blockKey(x, y, z) {
  return `${x},${y},${z}`;
}

export function createIsland(width = 28, depth = 28) {
  if (!Number.isInteger(width) || !Number.isInteger(depth) || width < 4 || depth < 4 || width > MAX_WORLD_SIZE || depth > MAX_WORLD_SIZE) {
    throw new RangeError(`Island dimensions must be integers between 4 and ${MAX_WORLD_SIZE}.`);
  }

  const blocks = new Map();
  const left = -Math.floor(width / 2);
  const front = -Math.floor(depth / 2);
  for (let z = front; z < front + depth; z += 1) {
    for (let x = left; x < left + width; x += 1) {
      blocks.set(blockKey(x, 0, z), 'grass');
      if (x > left && x < left + width - 1 && z > front && z < front + depth - 1) {
        blocks.set(blockKey(x, -1, z), 'dirt');
      }
      if (x > left + 1 && x < left + width - 2 && z > front + 1 && z < front + depth - 2) {
        blocks.set(blockKey(x, -2, z), 'stone');
      }
    }
  }
  if (width >= 24 && depth >= 24) {
    addCottage(blocks);
  }
  for (const [treeX, treeZ] of [[left + 3, front + 3], [left + width - 4, front + 3]]) {
    if (treeX < left + 1 || treeX > left + width - 2 || treeZ < front + 1 || treeZ > front + depth - 2) continue;
    for (let y = 1; y <= 3; y += 1) blocks.set(blockKey(treeX, y, treeZ), 'log');
    for (let y = 3; y <= 4; y += 1) {
      for (let z = treeZ - 1; z <= treeZ + 1; z += 1) {
        for (let x = treeX - 1; x <= treeX + 1; x += 1) {
          if (y === 3 && x === treeX && z === treeZ) continue;
          blocks.set(blockKey(x, y, z), 'leaves');
        }
      }
    }
    blocks.set(blockKey(treeX, 5, treeZ), 'leaves');
  }
  if (width >= 24 && depth >= 24) {
    addTrees(blocks);
  }
  return blocks;
}

export function getBlock(blocks, x, y, z) {
  return blocks.get(blockKey(Math.floor(x), Math.floor(y), Math.floor(z)));
}

export function getWorldBounds(blocks) {
  const cached = boundsCache.get(blocks);
  if (cached?.mapSize === blocks.size) return cached;
  if (blocks.size === 0) return { width: 0, height: 0, depth: 0, minX: 0, maxX: -1, minY: 0, maxY: -1, minZ: 0, maxZ: -1 };
  const positions = [...blocks.keys()].map((key) => key.split(',').map(Number));
  const axes = [0, 1, 2].map((axis) => positions.map((position) => position[axis]));
  const bounds = {
    width: Math.max(...axes[0]) - Math.min(...axes[0]) + 1,
    height: Math.max(...axes[1]) - Math.min(...axes[1]) + 1,
    depth: Math.max(...axes[2]) - Math.min(...axes[2]) + 1,
    minX: Math.min(...axes[0]), maxX: Math.max(...axes[0]),
    minY: Math.min(...axes[1]), maxY: Math.max(...axes[1]),
    minZ: Math.min(...axes[2]), maxZ: Math.max(...axes[2]),
    mapSize: blocks.size,
  };
  boundsCache.set(blocks, bounds);
  return bounds;
}

export function canOccupyPlayer(blocks, position) {
  const { x, y, z } = position;
  const bounds = getWorldBounds(blocks);
  if (!bounds.width || !Number.isFinite(x + y + z)) return false;

  const minX = bounds.minX;
  const maxX = bounds.maxX + 1;
  const minZ = bounds.minZ;
  const maxZ = bounds.maxZ + 1;
  if (x - PLAYER_RADIUS < minX || x + PLAYER_RADIUS > maxX || z - PLAYER_RADIUS < minZ || z + PLAYER_RADIUS > maxZ) return false;

  const minBlockX = Math.floor(x - PLAYER_RADIUS);
  const maxBlockX = Math.floor(x + PLAYER_RADIUS - 1e-6);
  const minBlockY = Math.floor(y + 1e-6);
  const maxBlockY = Math.floor(y + PLAYER_HEIGHT - 1e-6);
  const minBlockZ = Math.floor(z - PLAYER_RADIUS);
  const maxBlockZ = Math.floor(z + PLAYER_RADIUS - 1e-6);
  for (let bz = minBlockZ; bz <= maxBlockZ; bz += 1) {
    for (let by = minBlockY; by <= maxBlockY; by += 1) {
      for (let bx = minBlockX; bx <= maxBlockX; bx += 1) {
        if (blocks.has(blockKey(bx, by, bz))) return false;
      }
    }
  }
  return true;
}
