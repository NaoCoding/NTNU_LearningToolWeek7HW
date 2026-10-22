const blockKey = (x, y, z) => `${x},${y},${z}`;

export const TREE_PROFILES = [
  { trunk: 7, canopy: [{ y: 6, radius: 2 }, { y: 7, radius: 2 }, { y: 8, radius: 1 }, { y: 9, radius: 0 }] },
  { trunk: 9, canopy: [{ y: 8, radius: 1 }, { y: 9, radius: 2 }, { y: 10, radius: 1 }, { y: 11, radius: 0 }] },
  { trunk: 5, canopy: [{ y: 5, radius: 3 }, { y: 6, radius: 2 }, { y: 7, radius: 2 }, { y: 8, radius: 1 }, { y: 9, radius: 0 }] },
  { trunk: 8, canopy: [{ y: 5, radius: 2 }, { y: 6, radius: 2 }, { y: 7, radius: 1 }, { y: 8, radius: 2 }, { y: 9, radius: 1 }, { y: 10, radius: 0 }] },
  { trunk: 6, canopy: [{ y: 6, radius: 3 }, { y: 7, radius: 3 }, { y: 8, radius: 2 }, { y: 9, radius: 1 }, { y: 10, radius: 0 }] },
];

export const TREE_PLACEMENTS = [
  [-11, -11, 0], [-6, -11, 1], [2, -11, 2], [10, -10, 3],
  [11, -5, 0], [11, 3, 1], [10, 10, 2], [5, 10, 4], [-11, -6, 4], [-9, -8, 0],
];

function addTree(blocks, x, z, style) {
  const profile = TREE_PROFILES[style % TREE_PROFILES.length];
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
  for (const [x, z, style] of TREE_PLACEMENTS) addTree(blocks, x, z, style);
}
