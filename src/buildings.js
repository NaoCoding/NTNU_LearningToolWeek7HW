const blockKey = (x, y, z) => `${x},${y},${z}`;

export const HOUSE_STAIR_BLOCKS = [
  [-10, 1, 4], [-9, 2, 4], [-8, 3, 4], [-7, 4, 4],
];

export function isHouseStairBlock(x, y, z) {
  return HOUSE_STAIR_BLOCKS.some(([stairX, stairY, stairZ]) => stairX === x && stairY === y && stairZ === z);
}

function addTwoStoryHouse(blocks) {
  const centerX = -7;
  const centerZ = 4;
  const minX = centerX - 4;
  const maxX = centerX + 4;
  const minZ = centerZ - 4;
  const maxZ = centerZ + 4;

  for (let z = minZ; z <= maxZ; z += 1) {
    for (let x = minX; x <= maxX; x += 1) blocks.set(blockKey(x, 0, z), 'planks');
  }

  const isWindow = (x, z, y) => y === 2 && (
    (z === minZ && (x === centerX - 2 || x === centerX + 2)) ||
    (z === maxZ && (x === centerX - 3 || x === centerX + 3)) ||
    (x === minX && (z === centerZ - 2 || z === centerZ + 2)) ||
    (x === maxX && (z === centerZ - 2 || z === centerZ + 2))
  );
  const isUpperWindow = (x, z, y) => y === 6 && (
    (z === minZ && (x === centerX - 2 || x === centerX + 2)) ||
    (z === maxZ && (x === centerX - 2 || x === centerX + 2)) ||
    (x === minX && (z === centerZ - 2 || z === centerZ + 2)) ||
    (x === maxX && (z === centerZ - 2 || z === centerZ + 2))
  );
  for (let y = 1; y <= 3; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      for (const z of [minZ, maxZ]) {
        const isDoor = (z === minZ || z === maxZ) && (x === centerX || x === centerX + 1) && y <= 2;
        if (isDoor) continue;
        if (isWindow(x, z, y)) continue;
        blocks.set(blockKey(x, y, z), Math.abs(x - centerX) === 4 && Math.abs(z - centerZ) === 4 ? 'stone' : 'brick');
      }
    }
    for (let z = minZ + 1; z < maxZ; z += 1) {
      for (const x of [minX, maxX]) {
        if (isWindow(x, z, y)) continue;
        blocks.set(blockKey(x, y, z), 'stone');
      }
    }
  }

  for (let z = minZ + 1; z < maxZ; z += 1) {
    for (let x = minX + 1; x < maxX; x += 1) {
      const stairLane = z === centerZ && x >= minX + 1 && x <= centerX;
      if (!stairLane) blocks.set(blockKey(x, 4, z), 'planks');
    }
  }
  for (let step = 0; step < HOUSE_STAIR_BLOCKS.length; step += 1) {
    const [x, y] = HOUSE_STAIR_BLOCKS[step];
    blocks.set(blockKey(x, y, centerZ), 'planks');
    for (const z of [centerZ - 1, centerZ + 1]) blocks.set(blockKey(x, y + 1, z), 'log');
  }
  for (let y = 5; y <= 6; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      for (const z of [minZ, maxZ]) {
        const upperDoor = z === maxZ && (x === centerX || x === centerX + 1);
        if (upperDoor) continue;
        const upperWindow = isUpperWindow(x, z, y);
        if (upperWindow) continue;
        blocks.set(blockKey(x, y, z), 'planks');
      }
    }
    for (let z = minZ + 1; z < maxZ; z += 1) {
      for (const x of [minX, maxX]) {
        const upperWindow = isUpperWindow(x, z, y);
        if (upperWindow) continue;
        blocks.set(blockKey(x, y, z), 'planks');
      }
    }
  }

  for (let x = centerX - 2; x <= centerX + 2; x += 1) {
    blocks.set(blockKey(x, 0, maxZ + 1), 'planks');
    blocks.set(blockKey(x, 4, maxZ + 1), 'planks');
    if (x === centerX - 2 || x === centerX + 2) {
      for (let y = 1; y <= 3; y += 1) blocks.set(blockKey(x, y, maxZ + 1), 'log');
      blocks.set(blockKey(x, 5, maxZ + 1), 'log');
    }
  }
  for (let x = centerX; x <= centerX + 1; x += 1) blocks.set(blockKey(x, 0, minZ - 1), 'planks');
  for (let x = centerX - 2; x <= centerX + 2; x += 2) blocks.set(blockKey(x, 5, maxZ + 1), 'log');
  for (let x = minX + 2; x < centerX; x += 1) {
    blocks.set(blockKey(x, 5, centerZ + 1), 'log');
  }
  blocks.set(blockKey(centerX - 2, 5, centerZ + 1), 'planks');
  for (let z = minZ - 1; z <= maxZ + 1; z += 1) {
    for (let x = minX - 1; x <= maxX + 1; x += 1) {
      blocks.set(blockKey(x, 7, z), 'brick');
    }
  }
  for (let layer = 0; layer < 2; layer += 1) {
    for (let z = minZ + layer; z <= maxZ - layer; z += 1) {
      for (let x = minX + layer; x <= maxX - layer; x += 1) {
        if (z === minZ + layer || z === maxZ - layer || x === minX + layer || x === maxX - layer) {
          blocks.set(blockKey(x, 8 + layer, z), 'brick');
        }
      }
    }
  }
}

function addOutbuilding(blocks) {
  const centerX = 2;
  const centerZ = 8;
  for (let z = centerZ - 1; z <= centerZ + 1; z += 1) {
    for (let x = centerX - 1; x <= centerX + 1; x += 1) blocks.set(blockKey(x, 0, z), 'planks');
  }
  for (const y of [1, 2, 3]) {
    for (const [dx, dz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      blocks.set(blockKey(centerX + dx, y, centerZ + dz), 'log');
    }
  }
  for (let z = centerZ - 2; z <= centerZ + 2; z += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) {
      blocks.set(blockKey(x, 4, z), 'brick');
    }
  }
}

export function addBuildings(blocks) {
  addTwoStoryHouse(blocks);
  addOutbuilding(blocks);
}
