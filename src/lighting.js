export function worldLightLevelsAt(daylight, raining = false) {
  const level = Number.isFinite(daylight) ? Math.max(0, Math.min(1, daylight)) : 1;
  const rainDimmer = raining ? 0.82 : 1;
  return {
    sunlight: (0.78 + level * 1.22) * rainDimmer,
    hemisphere: (0.82 + level * 1.28) * (raining ? 0.8 : 1),
    skyDarkness: Math.min(1, 1 - level + (raining ? 0.18 : 0)),
  };
}
