import { addCottage } from './cottage.js';
import { addBuildings } from './buildings.js';
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
  const organicShape = width >= 24 && depth >= 24;
  const centerX = left + (width - 1) / 2;
  const centerZ = front + (depth - 1) / 2;
  const radiusX = width / 2;
  const radiusZ = depth / 2;
  for (let z = front; z < front + depth; z += 1) {
    for (let x = left; x < left + width; x += 1) {
      if (!organicShape) {
        blocks.set(blockKey(x, 0, z), 'grass');
        if (x > left && x < left + width - 1 && z > front && z < front + depth - 1) {
          blocks.set(blockKey(x, -1, z), 'dirt');
        }
        if (x > left + 1 && x < left + width - 2 && z > front + 1 && z < front + depth - 2) {
          blocks.set(blockKey(x, -2, z), 'stone');
        }
        continue;
      }

      const radius = Math.hypot((x - centerX) / radiusX, (z - centerZ) / radiusZ);
      const edgeNoise = 0.025 * Math.sin(x * 1.7 + z * 0.55) + 0.02 * Math.cos(z * 1.3 - x * 0.45);
      const materialNoise = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
      const layers = [
        { y: 0, radius: 1.02, material: 'surface' },
        { y: -1, radius: 1.1, material: 'slope' },
        { y: -2, radius: 0.9, material: 'stone' },
        { y: -3, radius: 0.64, material: 'stone' },
      ];
      for (const layer of layers) {
        if (radius > layer.radius + edgeNoise) continue;
        let type = layer.material;
        if (type === 'surface') {
          if (radius > 0.84) type = materialNoise > 0.68 ? 'stone' : 'sand';
          else if (radius > 0.62 && materialNoise > 0.96) type = 'stone';
          else type = 'grass';
        } else if (type === 'slope') {
          type = radius > 0.92 || materialNoise > 0.82 ? 'stone' : 'dirt';
        }
        blocks.set(blockKey(x, layer.y, z), type);
      }
    }
  }
  if (width >= 24 && depth >= 24) {
    addCottage(blocks);
    addBuildings(blocks);
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
