import { blockKey } from './world.js';

const ANIMAL_RADIUS = 0.48;
const ANIMAL_HEIGHT = 1.15;
const WALK_SPEED = 0.72;
const MIN_ANIMAL_SPACING = 0.95;
const TURN_OFFSETS = [0, Math.PI / 2, -Math.PI / 2, Math.PI / 4, -Math.PI / 4, Math.PI, 3 * Math.PI / 4, -3 * Math.PI / 4];

export function createAnimalStates(models) {
  return models.map((model, index) => ({
    type: model.type,
    x: model.position[0],
    y: model.position[1],
    z: model.position[2],
    heading: (model.phase ?? 0) + index * 0.71,
    turnTimer: 0.7 + index * 0.23,
    seed: (index + 1) * 2654435761 >>> 0,
  }));
}

function random(state) {
  state.seed = (1664525 * state.seed + 1013904223) >>> 0;
  return state.seed / 0x100000000;
}

export function canAnimalOccupy(world, position, otherAnimals = [], blockers = []) {
  const minX = Math.floor(position.x - ANIMAL_RADIUS);
  const maxX = Math.floor(position.x + ANIMAL_RADIUS - 1e-6);
  const minZ = Math.floor(position.z - ANIMAL_RADIUS);
  const maxZ = Math.floor(position.z + ANIMAL_RADIUS - 1e-6);
  for (let z = minZ; z <= maxZ; z += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (!world.has(blockKey(x, 0, z))) return false;
      for (let y = Math.floor(position.y + 1e-6); y <= Math.floor(position.y + ANIMAL_HEIGHT - 1e-6); y += 1) {
        if (world.has(blockKey(x, y, z))) return false;
      }
    }
  }
  for (const other of [...otherAnimals, ...blockers]) {
    const minimum = other.radius ?? MIN_ANIMAL_SPACING;
    if (other === position || !Number.isFinite(other.x + other.z)) continue;
    if (Math.hypot(position.x - other.x, position.z - other.z) < minimum) return false;
  }
  return true;
}

function moveAnimal(state, world, others, blockers, seconds) {
  const nextState = { ...state, turnTimer: state.turnTimer - seconds };
  if (nextState.turnTimer <= 0) {
    nextState.heading = random(nextState) * Math.PI * 2;
    nextState.turnTimer = 1.1 + random(nextState) * 2.4;
  }

  for (const offset of TURN_OFFSETS) {
    const heading = nextState.heading + offset;
    const candidate = {
      ...nextState,
      x: nextState.x + Math.cos(heading) * WALK_SPEED * seconds,
      z: nextState.z + Math.sin(heading) * WALK_SPEED * seconds,
    };
    if (!canAnimalOccupy(world, candidate, others, blockers)) continue;
    candidate.heading = heading;
    if (offset !== 0) candidate.turnTimer = Math.max(candidate.turnTimer, 0.8);
    return candidate;
  }

  nextState.heading = (nextState.heading + Math.PI / 3) % (Math.PI * 2);
  nextState.turnTimer = 0.15;
  return nextState;
}

export function updateAnimalMovement(states, world, deltaSeconds, blockers = []) {
  let remaining = Math.max(0, Number.isFinite(deltaSeconds) ? deltaSeconds : 0);
  let current = states.map((state) => ({ ...state }));
  while (remaining > 1e-8) {
    const delta = Math.min(remaining, 0.05);
    const next = [];
    for (let index = 0; index < current.length; index += 1) {
      const otherAnimals = [...next, ...current.slice(index + 1)];
      next.push(moveAnimal(current[index], world, otherAnimals, blockers, delta));
    }
    current = next;
    remaining -= delta;
  }
  return current;
}
