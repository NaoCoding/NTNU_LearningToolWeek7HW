const blockKey = (x, y, z) => `${x},${y},${z}`;

function addTwoStoryHouse(blocks) {
  const centerX = -7;
  const centerZ = 5;
  for (let z = centerZ - 2; z <= centerZ + 2; z += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) blocks.set(blockKey(x, 0, z), 'planks');
  }
  for (let y = 1; y <= 3; y += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) {
      for (const z of [centerZ - 2, centerZ + 2]) {
        if (z === centerZ + 2 && x === centerX && y <= 2) continue;
        blocks.set(blockKey(x, y, z), 'brick');
      }
    }
    for (let z = centerZ - 1; z <= centerZ + 1; z += 1) {
      for (const x of [centerX - 2, centerX + 2]) blocks.set(blockKey(x, y, z), 'brick');
    }
  }
  for (let z = centerZ - 2; z <= centerZ + 2; z += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) blocks.set(blockKey(x, 4, z), 'planks');
  }
  for (let y = 5; y <= 6; y += 1) {
    for (let x = centerX - 2; x <= centerX + 2; x += 1) {
      for (const z of [centerZ - 2, centerZ + 2]) blocks.set(blockKey(x, y, z), 'planks');
    }
    for (let z = centerZ - 1; z <= centerZ + 1; z += 1) {
      for (const x of [centerX - 2, centerX + 2]) blocks.set(blockKey(x, y, z), 'planks');
    }
  }
  for (let layer = 0; layer <= 1; layer += 1) {
    for (let z = centerZ - 3 + layer; z <= centerZ + 3 - layer; z += 1) {
      for (let x = centerX - 3 + layer; x <= centerX + 3 - layer; x += 1) {
        blocks.set(blockKey(x, 7 + layer, z), 'brick');
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
