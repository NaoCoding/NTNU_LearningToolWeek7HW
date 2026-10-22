export function worldLightLevelsAt(daylight) {
  const level = Number.isFinite(daylight) ? Math.max(0, Math.min(1, daylight)) : 1;
  return { sunlight: 0.95 + level * 1.05, hemisphere: 1 + level * 1.1 };
}
