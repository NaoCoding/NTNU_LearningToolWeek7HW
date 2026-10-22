const MINING_TIMES = Object.freeze({
  dirt: 0.82,
  grass: 0.82,
  leaves: 0.5,
  log: 1.2,
  stone: 2.0,
});

export function miningDuration(blockType) {
  return MINING_TIMES[blockType] ?? 1.0;
}

export function beginMining(blockKey, blockType) {
  return { blockKey, blockType, elapsed: 0 };
}

export function advanceMining(session, deltaSeconds) {
  if (!session) return { session: null, progress: 0, complete: false };
  const elapsed = Math.max(0, session.elapsed + Math.max(0, deltaSeconds));
  const progress = Math.min(1, elapsed / miningDuration(session.blockType));
  return {
    session: { ...session, elapsed },
    progress,
    complete: progress >= 1,
  };
}

export function cancelMining() {
  return null;
}
