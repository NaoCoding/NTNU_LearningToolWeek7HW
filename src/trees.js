const blockKey = (x, y, z) => `${x},${y},${z}`;

function addTree(blocks, x, z, style) {
  const profiles = [
    { trunk: 3, canopy: [{ y: 3, radius: 1 }, { y: 4, radius: 1 }, { y: 5, radius: 0 }] },
    { trunk: 5, canopy: [{ y: 5, radius: 1 }, { y: 6, radius: 1 }, { y: 7, radius: 0 }] },
    { trunk: 2, canopy: [{ y: 2, radius: 2 }, { y: 3, radius: 1 }, { y: 4, radius: 0 }] },
  ];
  const profile = profiles[style % profiles.length];
  for (let y = 1; y <= profile.trunk; y += 1) blocks.set(blockKey(x, y, z), 'log');
  for (const { y, radius } of profile.canopy) {
    for (let dz = -radius; dz <= radius; dz += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (Math.abs(dx) + Math.abs(dz) > radius + 1) continue;
        const key = blockKey(x + dx, y, z + dz);
        if (blocks.get(key) !== 'log') blocks.set(key, 'leaves');
      }
    }
  }
}

export function addTrees(blocks) {
  const trees = [
    [-9, -10, 0], [-7, -10, 1], [7, -10, 2], [10, -6, 0],
    [-11, -1, 2], [10, 2, 1], [-10, 8, 0], [-5, 10, 2], [5, 10, 1], [9, 7, 2],
  ];
  for (const [x, z, style] of trees) addTree(blocks, x, z, style);
}
