export const SHADOW_MAP_SIZE = 512;
export const LANTERN_LIGHT_DISTANCE = 8;
const LANTERN_PEAK_INTENSITY = 3.6;

export function lanternIntensityAt(darkness) {
  const level = Number.isFinite(darkness) ? Math.max(0, Math.min(1, darkness)) : 0;
  return level * LANTERN_PEAK_INTENSITY;
}
