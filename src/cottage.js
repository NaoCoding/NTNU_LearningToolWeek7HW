const blockKey = (x, y, z) => `${x},${y},${z}`;

export function addCottage(blocks) {
  const centerX = 7;
  for (let z = -3; z <= -1; z += 1) {
    for (let x = -1; x <= 1; x += 1) blocks.set(blockKey(centerX + x, 0, z), 'planks');
  }
  for (let y = 1; y <= 3; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      for (const z of [-4, 0]) {
        if (z === 0 && x === 0 && y <= 2) continue;
        blocks.set(blockKey(centerX + x, y, z), 'planks');
      }
    }
    for (let z = -3; z <= -1; z += 1) {
      for (const x of [-2, 2]) {
        if (y === 2 && z === -3) continue;
        blocks.set(blockKey(centerX + x, y, z), 'planks');
      }
    }
  }
  for (let layer = 0; layer <= 2; layer += 1) {
    const radius = 3 - layer;
    for (let z = -5 + layer; z <= 1 - layer; z += 1) {
      for (let x = -radius; x <= radius; x += 1) blocks.set(blockKey(centerX + x, 4 + layer, z), 'brick');
    }
  }
  for (let y = 4; y <= 6; y += 1) blocks.set(blockKey(centerX + 2, y, -3), 'stone');

  for (let z = 1; z <= 6; z += 1) blocks.set(blockKey(0, 0, z), 'sand');
  for (let x = 1; x <= centerX - 1; x += 1) blocks.set(blockKey(x, 0, 1), 'sand');
  for (let x = -1; x <= 1; x += 1) {
    for (let z = 0; z <= 1; z += 1) {
      if (z === 1 && x === 0) continue;
      blocks.set(blockKey(centerX + x, 0, z), 'brick');
    }
  }
  blocks.set(blockKey(centerX, 0, 1), 'sand');
}
