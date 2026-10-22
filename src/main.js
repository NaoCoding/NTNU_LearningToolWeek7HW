import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { advanceMining, beginMining, cancelMining, collectNearbyDrops, createDrop, createRainParticle, daylightAt, hasFallenIntoVoid, placeBlock, toggleRain, updateDrops, updateRainParticles } from './gameplay.js';
import { blockKey, canOccupyPlayer, createIsland, getBlock, stepUpPlayerOnStairs } from './world.js';
import { advancePlayerVertical, playerMovementSpeed } from './physics.js';
import { worldLightLevelsAt } from './lighting.js';
import { DEFAULT_RAIN_ENABLED } from './gameplay.js';
import { FIRST_PERSON_HAND_ORIGIN, FIRST_PERSON_HAND_PARTS, PLAYER_MODEL_PARTS } from './avatar.js';
import { togglePerspective } from './view-mode.js';
import { consumeJumpRequest } from './player-input.js';
import { getAvatarFacing, getAvatarMotion, getThirdPersonCameraPose } from './avatar-motion.js';
import { SCENERY_DETAILS } from './scenery-details.js';
import { ANIMAL_MODELS } from './animal-models.js';
import { createAnimalStates, getAnimalPose, updateAnimalMovement } from './animal-motion.js';
import { LANTERN_LIGHT_DISTANCE, SHADOW_MAP_SIZE, lanternIntensityAt } from './visual-effects.js';

const game = document.querySelector('#game');
const startButton = document.querySelector('#start');
const statusLabel = document.querySelector('#status');
const helpLabel = document.querySelector('#help');
const worldTimeLabel = document.querySelector('#world-time');
const world = createIsland();
const startingPosition = new THREE.Vector3(0.5, 2.65, 4.5);
const hotbarTypes = ['grass', 'dirt', 'stone', 'log', 'leaves', 'planks', 'sand', 'brick'];
let inventory = Object.fromEntries(hotbarTypes.map((type) => [type, 0]));
let selectedSlot = 0;
const hotbar = document.querySelector('#hotbar');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#bfe0f4');
scene.fog = new THREE.Fog('#bfe0f4', 18, 45);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 100);
camera.position.copy(startingPosition);
camera.lookAt(0.5, 1.75, -4);
scene.add(camera);
const thirdPersonCamera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
game.prepend(renderer.domElement);

const hemisphere = new THREE.HemisphereLight('#e8f6ff', '#715a3c', 2.1);
scene.add(hemisphere);
const sunlight = new THREE.DirectionalLight('#fff1cf', 2.0);
sunlight.position.set(-8, 14, 7);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
sunlight.shadow.camera.left = -18;
sunlight.shadow.camera.right = 18;
sunlight.shadow.camera.top = 20;
sunlight.shadow.camera.bottom = -15;
sunlight.shadow.camera.near = 1;
sunlight.shadow.camera.far = 45;
sunlight.shadow.bias = -0.0004;
sunlight.shadow.radius = 3;
scene.add(sunlight);
const daySky = new THREE.Color('#bfe0f4');
const nightSky = new THREE.Color('#0b1229');
const daySun = new THREE.Color('#fff1cf');
const nightSun = new THREE.Color('#8296c7');

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
function texture(name) {
  if (!textureCache.has(name)) {
    const map = textureLoader.load(`sky-island-assets/textures/16px/${name}.png`);
    map.magFilter = THREE.NearestFilter;
    map.minFilter = THREE.NearestFilter;
    map.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(name, map);
  }
  return textureCache.get(name);
}

const materials = {
  grass: [texture('grass_side'), texture('grass_side'), texture('grass_top'), texture('dirt'), texture('grass_side'), texture('grass_side')].map((map) => new THREE.MeshLambertMaterial({ map })),
  dirt: new THREE.MeshLambertMaterial({ map: texture('dirt') }),
  stone: new THREE.MeshLambertMaterial({ map: texture('stone') }),
  planks: new THREE.MeshLambertMaterial({ map: texture('planks') }),
  sand: new THREE.MeshLambertMaterial({ map: texture('sand') }),
  brick: new THREE.MeshLambertMaterial({ map: texture('brick') }),
  log: [texture('log_side'), texture('log_side'), texture('log_top'), texture('log_top'), texture('log_side'), texture('log_side')].map((map) => new THREE.MeshLambertMaterial({ map })),
  leaves: new THREE.MeshLambertMaterial({ map: texture('leaves'), transparent: true, alphaTest: 0.15 }),
};
const cube = new THREE.BoxGeometry(1, 1, 1);
const blockTypes = ['grass', 'dirt', 'stone', 'log', 'leaves', 'planks', 'sand', 'brick'];
let meshes = [];
function renderWorld() {
  for (const mesh of meshes) scene.remove(mesh);
  meshes = [];
  for (const type of blockTypes) {
    const entries = [...world.entries()].filter(([, blockType]) => blockType === type);
    if (entries.length === 0) continue;
    const mesh = new THREE.InstancedMesh(cube, materials[type], entries.length);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.blockKeys = entries.map(([key]) => key);
    const matrix = new THREE.Matrix4();
    entries.forEach(([key], index) => {
      const [x, y, z] = key.split(',').map(Number);
      matrix.makeTranslation(x + 0.5, y + 0.5, z + 0.5);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
    meshes.push(mesh);
  }
}
renderWorld();

const lanternLights = [];
for (const detail of SCENERY_DETAILS) {
  let geometry;
  let material;
  if (detail.shape === 'cone') {
    geometry = new THREE.ConeGeometry(detail.radius, detail.height, 4);
    material = materials[detail.texture];
  } else if (detail.shape === 'post') {
    geometry = new THREE.BoxGeometry(...detail.size);
    material = materials[detail.texture];
  } else if (detail.shape === 'octahedron') {
    geometry = new THREE.OctahedronGeometry(detail.radius, 0);
    material = new THREE.MeshBasicMaterial({ color: detail.color });
  } else {
    geometry = new THREE.BoxGeometry(...detail.size);
    material = new THREE.MeshBasicMaterial({ color: detail.color, transparent: true, opacity: 0.62 });
  }
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...detail.position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  if (detail.glow) {
    const light = new THREE.PointLight(detail.color, 0, LANTERN_LIGHT_DISTANCE);
    light.position.copy(mesh.position);
    scene.add(light);
    lanternLights.push(light);
  }
}

const animalActors = ANIMAL_MODELS.map((animal) => {
  const group = new THREE.Group();
  group.position.set(...animal.position);
  scene.add(group);
  const legs = new Map();
  for (const detail of animal.parts) {
    const geometry = detail.shape === 'sphere'
      ? new THREE.SphereGeometry(0.5, 8, 6)
      : new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: detail.color }));
    mesh.position.set(...detail.position);
    mesh.scale.set(...detail.size);
    mesh.castShadow = animal.castShadow;
    mesh.receiveShadow = true;
    group.add(mesh);
    if (detail.limb) legs.set(detail.limb, mesh);
  }
  return { group, legs };
});
let animalStates = createAnimalStates(ANIMAL_MODELS);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.92;
controls.minPolarAngle = Math.PI * 0.08;
let gameStarted = false;
let thirdPerson = false;
const controlHint = 'WASD move · Shift run · Space jump · V view · Hold left to mine · Right to place · 1–8 select · R rain';
startButton.addEventListener('click', () => {
  gameStarted = true;
  startButton.hidden = true;
  helpLabel.textContent = controlHint;
  statusLabel.textContent = 'Explore the island';
  controls.lock();
});
controls.addEventListener('lock', () => {
  gameStarted = true;
  startButton.hidden = true;
  helpLabel.textContent = controlHint;
  statusLabel.textContent = 'Explore the island';
});
controls.addEventListener('unlock', () => {
  gameStarted = false;
  startButton.hidden = false;
  helpLabel.textContent = 'Click to resume · ' + controlHint;
  statusLabel.textContent = 'Paused';
});

const keys = new Set();
let verticalVelocity = 0;
let grounded = false;
let jumpRequested = false;
const eyeHeight = 1.65;
const avatar = new THREE.Group();
const avatarParts = new Map();
const avatarHead = new THREE.Group();
for (const part of PLAYER_MODEL_PARTS) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...part.size),
    new THREE.MeshLambertMaterial({ color: part.color }),
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (part.name === 'head' || part.name === 'hair') {
    mesh.position.set(part.position[0], part.position[1] - 1.61, part.position[2]);
    avatarHead.add(mesh);
  } else {
    mesh.position.set(...part.position);
    avatar.add(mesh);
  }
  avatarParts.set(part.name, mesh);
}
avatarHead.position.y = 1.61;
avatar.add(avatarHead);
avatarParts.set('head-group', avatarHead);
avatar.visible = false;
scene.add(avatar);

const firstPersonHand = new THREE.Group();
for (const part of FIRST_PERSON_HAND_PARTS) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(...part.size),
    new THREE.MeshBasicMaterial({ color: part.color }),
  );
  mesh.position.set(...part.position);
  firstPersonHand.add(mesh);
}
firstPersonHand.position.set(...FIRST_PERSON_HAND_ORIGIN);
firstPersonHand.rotation.x = -0.2;
firstPersonHand.rotation.z = -0.1;
camera.add(firstPersonHand);

function setPerspective(isThirdPerson) {
  thirdPerson = isThirdPerson;
  avatar.visible = thirdPerson;
  firstPersonHand.visible = !thirdPerson;
  statusLabel.textContent = thirdPerson ? 'Third-person view · V to switch' : 'First-person view · V to switch';
}

addEventListener('keydown', (event) => {
  keys.add(event.code);
  if (event.code === 'KeyR' && gameStarted && !event.repeat) setRain(toggleRain(rainEnabled));
  if (event.code === 'KeyV' && gameStarted && !event.repeat) setPerspective(togglePerspective(thirdPerson));
  if (/^Digit[1-8]$/.test(event.code)) {
    selectedSlot = Number(event.code.slice(-1)) - 1;
    renderHotbar();
  }
  if (event.code === 'Space') {
    event.preventDefault();
    if (!event.repeat) jumpRequested = true;
  }
});
addEventListener('keyup', (event) => keys.delete(event.code));

const raycaster = new THREE.Raycaster();
const look = new THREE.Vector3();
const clock = new THREE.Clock();
const crackTextures = Array.from({ length: 10 }, (_, index) => {
  const map = textureLoader.load(`sky-island-assets/textures/16px/destroy_stage_${index}.png`);
  map.magFilter = THREE.NearestFilter;
  map.minFilter = THREE.NearestFilter;
  return map;
});
let miningSession = null;
let miningHeld = false;
let crackMesh = null;
let crackStage = -1;
let dropStates = [];
const dropMeshes = new Map();
const pickupAnimations = [];
let rainEnabled = DEFAULT_RAIN_ENABLED;
let rainStates = [];
const rainCount = 160;
const rainGeometry = new THREE.BufferGeometry();
const rainPositions = new Float32Array(rainCount * 6);
rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3).setUsage(THREE.DynamicDrawUsage));
const rainMaterial = new THREE.LineBasicMaterial({ color: '#d8f4ff', transparent: true, opacity: 0.68, depthWrite: false });
const rainLines = new THREE.LineSegments(rainGeometry, rainMaterial);
rainLines.visible = false;
scene.add(rainLines);

function setRain(enabled) {
  rainEnabled = enabled;
  rainLines.visible = enabled;
  if (enabled) {
    rainStates = [];
    let attempts = 0;
    while (rainStates.length < rainCount && attempts < rainCount * 3) {
      attempts += 1;
      const x = camera.position.x + (Math.random() - 0.5) * 13;
      const z = camera.position.z + (Math.random() - 0.5) * 13;
      const particle = createRainParticle(world, x, camera.position.y + 5 + Math.random() * 3, z);
      if (particle) rainStates.push(particle);
    }
    statusLabel.textContent = 'Rain started · R to stop';
  } else statusLabel.textContent = 'Rain stopped';
}
setRain(DEFAULT_RAIN_ENABLED);

function updateRain(deltaSeconds) {
  if (!rainEnabled) return;
  rainStates = updateRainParticles(rainStates, world, deltaSeconds, camera.position.y + 7);
  rainStates.forEach((particle, index) => {
    const offset = index * 6;
    rainPositions[offset] = particle.x;
    rainPositions[offset + 1] = particle.y;
    rainPositions[offset + 2] = particle.z;
    rainPositions[offset + 3] = particle.x - 0.025;
    rainPositions[offset + 4] = particle.y - 0.24;
    rainPositions[offset + 5] = particle.z - 0.025;
  });
  rainGeometry.setDrawRange(0, rainStates.length * 2);
  rainGeometry.attributes.position.needsUpdate = true;
}

function renderHotbar() {
  hotbar.replaceChildren();
  hotbarTypes.forEach((type, index) => {
    const slot = document.createElement('div');
    slot.className = `slot${index === selectedSlot ? ' selected' : ''}`;
    slot.setAttribute('role', 'img');
    slot.setAttribute('aria-label', `${index + 1}: ${type}, ${inventory[type] ?? 0}`);
    const icon = document.createElement('img');
    icon.src = `sky-island-assets/icons/${type}.png`;
    icon.alt = '';
    const count = document.createElement('span');
    count.textContent = String(inventory[type] ?? 0);
    slot.append(icon, count);
    hotbar.append(slot);
  });
}
renderHotbar();

function spawnDrop(key, type) {
  const state = createDrop(key, type);
  const mesh = new THREE.Mesh(cube, materials[type]);
  mesh.scale.setScalar(state.size);
  mesh.position.set(state.x, state.y, state.z);
  scene.add(mesh);
  dropStates.push(state);
  dropMeshes.set(state.id, mesh);
}

function updateDropMeshes(deltaSeconds) {
  dropStates = updateDrops(dropStates, world, deltaSeconds);
  for (const drop of dropStates) {
    const mesh = dropMeshes.get(drop.id);
    mesh.position.set(drop.x, drop.y, drop.z);
    mesh.rotation.y = drop.rotation;
  }
  if (gameStarted && dropStates.length) {
    const result = collectNearbyDrops(dropStates, camera.position, inventory);
    dropStates = result.remainingDrops;
    if (result.collected.length) {
      inventory = result.inventory;
      for (const drop of result.collected) {
        const mesh = dropMeshes.get(drop.id);
        dropMeshes.delete(drop.id);
        pickupAnimations.push({ mesh, start: mesh.position.clone(), elapsed: 0, duration: 0.22, size: drop.size });
      }
      renderHotbar();
      statusLabel.textContent = 'Block collected';
    }
  }
  for (let index = pickupAnimations.length - 1; index >= 0; index -= 1) {
    const animation = pickupAnimations[index];
    animation.elapsed += deltaSeconds;
    const progress = Math.min(1, animation.elapsed / animation.duration);
    animation.mesh.position.lerpVectors(animation.start, camera.position, progress);
    animation.mesh.scale.setScalar(animation.size * (1 - progress));
    if (progress >= 1) {
      scene.remove(animation.mesh);
      pickupAnimations.splice(index, 1);
    }
  }
}

function targetedBlock() {
  controls.getDirection(look);
  raycaster.set(camera.position, look);
  raycaster.far = 5;
  const hit = raycaster.intersectObjects(meshes, false)[0];
  if (!hit || hit.instanceId === undefined) return null;
  const key = hit.object.userData.blockKeys[hit.instanceId];
  return { key, type: getBlock(world, ...key.split(',').map(Number)), hit };
}

function clearCracks() {
  if (crackMesh) scene.remove(crackMesh);
  crackMesh = null;
  crackStage = -1;
}

function showCracks(hit, progress) {
  const stage = Math.min(9, Math.floor(progress * 10));
  if (!crackMesh) {
    crackMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.03, 1.03),
      new THREE.MeshBasicMaterial({ map: crackTextures[stage], transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
    );
    crackMesh.renderOrder = 2;
    scene.add(crackMesh);
  }
  if (stage !== crackStage) {
    crackMesh.material.map = crackTextures[stage];
    crackMesh.material.needsUpdate = true;
    crackStage = stage;
  }
  const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
  crackMesh.position.copy(hit.point).addScaledVector(normal, 0.014);
  crackMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
}

renderer.domElement.addEventListener('mousedown', (event) => {
  if (event.button === 2 && gameStarted) {
    event.preventDefault();
    const target = targetedBlock();
    if (!target) return;
    const type = hotbarTypes[selectedSlot];
    const result = placeBlock(world, target.key, target.hit.face.normal, type, inventory, {
      x: camera.position.x,
      y: camera.position.y - eyeHeight,
      z: camera.position.z,
    });
    if (result.placed) {
      inventory = result.inventory;
      renderWorld();
      renderHotbar();
      statusLabel.textContent = `${type} placed`;
    } else if (result.reason === 'empty-inventory') {
      statusLabel.textContent = `No ${type} blocks in this slot`;
    } else if (result.reason === 'occupied') {
      statusLabel.textContent = 'That space is occupied';
    } else if (result.reason === 'player-overlap') {
      statusLabel.textContent = 'Cannot place a block inside yourself';
    } else if (result.reason === 'too-close') {
      statusLabel.textContent = 'Cannot place a block so close to yourself';
    }
    return;
  }
  if (event.button !== 0 || !gameStarted) return;
  const target = targetedBlock();
  if (!target) return;
  miningHeld = true;
  miningSession = beginMining(target.key, target.type);
});
renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
addEventListener('mouseup', (event) => {
  if (event.button !== 0 || !miningHeld) return;
  miningHeld = false;
  miningSession = cancelMining(miningSession);
  clearCracks();
});

function tick() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updateDayNight(clock.elapsedTime);
  let movementDirection = null;
  if (gameStarted) {
    const forward = Number(keys.has('KeyW')) - Number(keys.has('KeyS'));
    const side = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
    const speed = playerMovementSpeed(keys.has('ShiftLeft') || keys.has('ShiftRight')) * delta;
    controls.getDirection(look);
    const lookLength = Math.hypot(look.x, look.z) || 1;
    const forwardX = look.x / lookLength;
    const forwardZ = look.z / lookLength;
    const moveX = forward * forwardX - side * forwardZ;
    const moveZ = forward * forwardZ + side * forwardX;
    const moveLength = Math.hypot(moveX, moveZ);
    const before = camera.position.clone();
    if (moveLength > 0) {
      camera.position.x += (moveX / moveLength) * speed;
      camera.position.z += (moveZ / moveLength) * speed;
    }
    const feet = { x: camera.position.x, y: camera.position.y - eyeHeight, z: camera.position.z };
    let canMove = canOccupyPlayer(world, feet);
    if (!canMove) {
      const previousFeet = { x: before.x, y: before.y - eyeHeight, z: before.z };
      const steppedFeet = grounded ? stepUpPlayerOnStairs(world, previousFeet, feet) : null;
      if (steppedFeet) {
        camera.position.y = steppedFeet.y + eyeHeight;
        verticalVelocity = 0;
        canMove = true;
      } else camera.position.set(before.x, camera.position.y, before.z);
    }
    if (moveLength > 0 && canMove) movementDirection = { x: moveX / moveLength, z: moveZ / moveLength };

    const jump = consumeJumpRequest(jumpRequested, grounded);
    jumpRequested = jump.pending;
    if (jump.shouldJump) { verticalVelocity = 6.2; grounded = false; }
    const vertical = advancePlayerVertical(world, {
      x: camera.position.x,
      y: camera.position.y - eyeHeight,
      z: camera.position.z,
    }, verticalVelocity, grounded, delta);
    camera.position.y = vertical.position.y + eyeHeight;
    verticalVelocity = vertical.velocityY;
    grounded = vertical.grounded;
    if (hasFallenIntoVoid(vertical.position)) {
      camera.position.copy(startingPosition);
      verticalVelocity = 0;
      grounded = true;
      statusLabel.textContent = 'Returned to the starting point';
    }

    const target = targetedBlock();
    if (miningHeld && target) {
      if (miningSession?.blockKey !== target.key) miningSession = beginMining(target.key, target.type);
      const result = advanceMining(miningSession, delta);
      miningSession = result.session;
      showCracks(target.hit, result.progress);
      statusLabel.textContent = `Mining ${target.type} · ${Math.round(result.progress * 100)}%`;
      if (result.complete) {
        world.delete(target.key);
        spawnDrop(target.key, target.type);
        miningHeld = false;
        miningSession = null;
        clearCracks();
        renderWorld();
        statusLabel.textContent = 'Block mined';
      }
    } else {
      if (miningSession) {
        miningSession = cancelMining(miningSession);
        clearCracks();
      }
      if (target) statusLabel.textContent = 'Hold left click to mine';
    }
  }
  controls.getDirection(look);
  const moving = movementDirection !== null;
  const running = keys.has('ShiftLeft') || keys.has('ShiftRight');
  const motion = getAvatarMotion(clock.elapsedTime, moving, running, grounded, look.y);
  const facing = getAvatarFacing(look, movementDirection);
  avatarParts.get('left-arm').rotation.x = motion.leftArmX;
  avatarParts.get('right-arm').rotation.x = motion.rightArmX;
  avatarParts.get('left-leg').rotation.x = motion.leftLegX;
  avatarParts.get('right-leg').rotation.x = motion.rightLegX;
  avatarHead.rotation.set(motion.headPitch, facing.headYaw, 0);
  firstPersonHand.position.x = FIRST_PERSON_HAND_ORIGIN[0] + motion.handX;
  firstPersonHand.position.y = FIRST_PERSON_HAND_ORIGIN[1] + motion.handY;
  firstPersonHand.rotation.z = -0.1 + motion.handRotationZ;
  updateDropMeshes(delta);
  updateRain(delta);
  animalStates = updateAnimalMovement(animalStates, world, delta, [{
    x: camera.position.x,
    z: camera.position.z,
    radius: 0.55,
  }]);
  animalActors.forEach(({ group, legs }, index) => {
    const animal = animalStates[index];
    const pose = getAnimalPose(animal, clock.elapsedTime);
    group.position.set(animal.x, animal.y + pose.hopY, animal.z);
    group.rotation.y = -animal.heading;
    legs.get('left-leg').rotation.x = pose.leftLegX;
    legs.get('right-leg').rotation.x = pose.rightLegX;
  });
  if (thirdPerson) {
    const feetY = camera.position.y - eyeHeight;
    avatar.position.set(camera.position.x, feetY, camera.position.z);
    avatar.rotation.y = facing.bodyYaw;
    const pose = getThirdPersonCameraPose(camera.position, look);
    thirdPersonCamera.position.set(pose.position.x, pose.position.y, pose.position.z);
    thirdPersonCamera.lookAt(pose.target.x, pose.target.y, pose.target.z);
  }
  renderer.render(scene, thirdPerson ? thirdPersonCamera : camera);
}
renderer.setAnimationLoop(tick);

function updateDayNight(elapsedSeconds) {
  const daylight = daylightAt(elapsedSeconds, 120);
  const darkness = 1 - daylight;
  for (const lantern of lanternLights) lantern.intensity = lanternIntensityAt(darkness);
  const lightLevels = worldLightLevelsAt(daylight, rainEnabled);
  scene.background.copy(daySky).lerp(nightSky, lightLevels.skyDarkness);
  scene.fog.color.copy(scene.background);
  sunlight.intensity = lightLevels.sunlight;
  sunlight.color.copy(daySun).lerp(nightSun, darkness);
  hemisphere.intensity = lightLevels.hemisphere;
  const isDay = daylight >= 0.45;
  worldTimeLabel.textContent = isDay ? 'DAY' : 'NIGHT';
  worldTimeLabel.classList.toggle('night', !isDay);
}
updateDayNight(0);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  thirdPersonCamera.aspect = innerWidth / innerHeight;
  thirdPersonCamera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
