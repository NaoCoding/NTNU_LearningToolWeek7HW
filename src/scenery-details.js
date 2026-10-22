export const WORLD_LANTERN_POSITIONS = [
  [-12, 4], [-8, -12], [0, -12], [7, -11],
  [11, -7], [12, 1], [5, 12], [-3, 12],
];

export const SCENERY_DETAILS = [
  ...WORLD_LANTERN_POSITIONS.flatMap(([x, z]) => [
    { shape: 'post', position: [x, 1.65, z], size: [0.14, 1.3, 0.14], texture: 'log' },
    { shape: 'octahedron', position: [x, 2.58, z], radius: 0.28, color: '#ffd36a', glow: true },
  ]),
  { shape: 'cone', position: [-7, 9.5, 4], radius: 5.45, height: 3, texture: 'brick' },
  { shape: 'octahedron', position: [-9.5, 4.3, 9.05], radius: 0.2, color: '#ffd36a', glow: true },
  { shape: 'octahedron', position: [-4.5, 4.3, 9.05], radius: 0.2, color: '#ffd36a', glow: true },
  ...[
    { y: 2.5, front: [-9.5, -3.5], back: [-8.5, -4.5] },
    { y: 6.5, front: [-8.5, -4.5], back: [-8.5, -4.5] },
  ].flatMap(({ y, front, back }) => [
    ...front.map((x) => ({ shape: 'glass', position: [x, y, 9.015], size: [0.72, 0.72, 0.04], color: '#a9e6e5' })),
    ...back.map((x) => ({ shape: 'glass', position: [x, y, -0.015], size: [0.72, 0.72, 0.04], color: '#a9e6e5' })),
  ]),
  ...[2.5, 6.5].flatMap((z) => [2.5, 6.5].flatMap((y) => [
    { shape: 'glass', position: [-11.015, y, z], size: [0.04, 0.72, 0.72], color: '#a9e6e5' },
    { shape: 'glass', position: [-2.985, y, z], size: [0.04, 0.72, 0.72], color: '#a9e6e5' },
  ])),
];
