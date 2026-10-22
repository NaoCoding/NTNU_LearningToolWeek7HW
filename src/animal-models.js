const part = (shape, position, size, color, limb) => ({
  shape, position, size, color,
  ...(limb ? { limb } : {}),
});

export const ANIMAL_MODELS = [
  {
    type: 'rabbit', position: [3, 1, 3], phase: 0, castShadow: true,
    parts: [
      part('box', [0, 0.36, 0], [0.48, 0.34, 0.32], '#e7e0d2'),
      part('box', [0.22, 0.62, 0], [0.28, 0.28, 0.28], '#f4eddf'),
      part('box', [0.18, 0.91, -0.08], [0.1, 0.42, 0.1], '#f4eddf'),
      part('box', [0.28, 0.9, 0.08], [0.1, 0.36, 0.1], '#f4eddf'),
      part('box', [0.36, 0.66, 0.15], [0.06, 0.06, 0.04], '#332b2b'),
      part('box', [-0.12, 0.14, -0.11], [0.1, 0.28, 0.1], '#c9bba5', 'left-leg'),
      part('box', [-0.12, 0.14, 0.11], [0.1, 0.28, 0.1], '#c9bba5', 'right-leg'),
      part('sphere', [-0.27, 0.4, 0], [0.13, 0.13, 0.13], '#fff8e8'),
    ],
  },
  {
    type: 'rabbit', position: [-1, 1, -8], phase: 1.8, castShadow: true,
    parts: [
      part('box', [0, 0.36, 0], [0.48, 0.34, 0.32], '#b98d62'),
      part('box', [0.22, 0.62, 0], [0.28, 0.28, 0.28], '#c89c70'),
      part('box', [0.18, 0.91, -0.08], [0.1, 0.42, 0.1], '#c89c70'),
      part('box', [0.28, 0.9, 0.08], [0.1, 0.36, 0.1], '#c89c70'),
      part('box', [0.36, 0.66, 0.15], [0.06, 0.06, 0.04], '#332b2b'),
      part('box', [-0.12, 0.14, -0.11], [0.1, 0.28, 0.1], '#9a6e49', 'left-leg'),
      part('box', [-0.12, 0.14, 0.11], [0.1, 0.28, 0.1], '#9a6e49', 'right-leg'),
      part('sphere', [-0.27, 0.4, 0], [0.13, 0.13, 0.13], '#f1c6b5'),
    ],
  },
  {
    type: 'chicken', position: [7, 1, 5], phase: 0.9, castShadow: true,
    parts: [
      part('sphere', [0, 0.42, 0], [0.48, 0.48, 0.42], '#f6f0df'),
      part('sphere', [0.16, 0.7, 0], [0.3, 0.3, 0.28], '#fff8e8'),
      part('box', [0.39, 0.68, 0], [0.16, 0.1, 0.12], '#e49a32'),
      part('box', [0.13, 0.88, 0], [0.16, 0.12, 0.16], '#c64d42'),
      part('sphere', [0.27, 0.73, 0.14], [0.045, 0.045, 0.045], '#282525'),
      part('box', [-0.08, 0.13, -0.1], [0.07, 0.26, 0.07], '#d99437', 'left-leg'),
      part('box', [-0.08, 0.13, 0.1], [0.07, 0.26, 0.07], '#d99437', 'right-leg'),
    ],
  },
  {
    type: 'chicken', position: [-4, 1, -9], phase: 2.4, castShadow: true,
    parts: [
      part('sphere', [0, 0.42, 0], [0.48, 0.48, 0.42], '#e1a44e'),
      part('sphere', [0.16, 0.7, 0], [0.3, 0.3, 0.28], '#f0bb63'),
      part('box', [0.39, 0.68, 0], [0.16, 0.1, 0.12], '#e49a32'),
      part('box', [0.13, 0.88, 0], [0.16, 0.12, 0.16], '#c64d42'),
      part('sphere', [0.27, 0.73, 0.14], [0.045, 0.045, 0.045], '#282525'),
      part('box', [-0.08, 0.13, -0.1], [0.07, 0.26, 0.07], '#d99437', 'left-leg'),
      part('box', [-0.08, 0.13, 0.1], [0.07, 0.26, 0.07], '#d99437', 'right-leg'),
    ],
  },
];

const extraAnimalSpawns = [
  { source: 0, position: [-10.5, 1, -2.5], phase: 2.7 },
  { source: 0, position: [8.5, 1, -10.5], phase: 4.1 },
  { source: 0, position: [-11.5, 1, 8.5], phase: 5.3 },
  { source: 0, position: [3.5, 1, -12.5], phase: 6.2 },
  { source: 2, position: [10.5, 1, 8.5], phase: 3.3 },
  { source: 2, position: [-0.5, 1, 10.5], phase: 4.7 },
  { source: 2, position: [10.5, 1, 2.5], phase: 5.8 },
  { source: 2, position: [-13.5, 1, -4.5], phase: 6.9 },
];

ANIMAL_MODELS.push(...extraAnimalSpawns.map(({ source, position, phase }) => ({
  ...ANIMAL_MODELS[source],
  position,
  phase,
})));
