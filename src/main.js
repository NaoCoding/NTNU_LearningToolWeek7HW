import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { advanceMining, beginMining, cancelMining, collectNearbyDrops, createDrop, updateDrops } from './gameplay.js';
import { blockKey, canOccupyPlayer, createIsland, getBlock } from './world.js';

const game = document.querySelector('#game');
const startButton = document.querySelector('#start');
const statusLabel = document.querySelector('#status');
const helpLabel = document.querySelector('#help');
const world = createIsland();
const hotbarTypes = ['grass', 'dirt', 'stone', 'log', 'leaves', 'planks', 'sand', 'brick'];
let inventory = Object.fromEntries(hotbarTypes.map((type) => [type, 0]));
let selectedSlot = 0;
const hotbar = document.querySelector('#hotbar');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#bfe0f4');
scene.fog = new THREE.Fog('#bfe0f4', 18, 45);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0.5, 2.65, 4.5);
camera.lookAt(0.5, 1.75, -4);
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'low-power' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = false;
game.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight('#e8f6ff', '#715a3c', 2.1));
const sunlight = new THREE.DirectionalLight('#fff1cf', 2.0);
sunlight.position.set(-8, 14, 7);
scene.add(sunlight);

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
  log: [texture('log_side'), texture('log_side'), texture('log_top'), texture('log_top'), texture('log_side'), texture('log_side')].map((map) => new THREE.MeshLambertMaterial({ map })),
  leaves: new THREE.MeshLambertMaterial({ map: texture('leaves'), transparent: true, alphaTest: 0.15 }),
};
const cube = new THREE.BoxGeometry(1, 1, 1);
const blockTypes = ['grass', 'dirt', 'stone', 'log', 'leaves'];
let meshes = [];
function renderWorld() {
  for (const mesh of meshes) scene.remove(mesh);
  meshes = [];
  for (const type of blockTypes) {
    const entries = [...world.entries()].filter(([, blockType]) => blockType === type);
    if (entries.length === 0) continue;
    const mesh = new THREE.InstancedMesh(cube, materials[type], entries.length);
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

const controls = new PointerLockControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.92;
controls.minPolarAngle = Math.PI * 0.08;
let gameStarted = false;
startButton.addEventListener('click', () => {
  gameStarted = true;
  startButton.hidden = true;
  helpLabel.textContent = 'WASD move · Space jump · Esc pause';
  statusLabel.textContent = 'Explore the island';
  controls.lock();
});
controls.addEventListener('lock', () => {
  gameStarted = true;
  startButton.hidden = true;
  helpLabel.textContent = 'WASD move · Space jump · Esc pause';
  statusLabel.textContent = 'Explore the island';
});
controls.addEventListener('unlock', () => {
  gameStarted = false;
  startButton.hidden = false;
  helpLabel.textContent = 'WASD move · Space jump · Click to resume';
  statusLabel.textContent = 'Paused';
});

const keys = new Set();
let verticalVelocity = 0;
let grounded = false;
const eyeHeight = 1.65;
addEventListener('keydown', (event) => {
  keys.add(event.code);
  if (/^Digit[1-8]$/.test(event.code)) {
    selectedSlot = Number(event.code.slice(-1)) - 1;
    renderHotbar();
  }
  if (event.code === 'Space') event.preventDefault();
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
  if (event.button !== 0 || !gameStarted) return;
  const target = targetedBlock();
  if (!target) return;
  miningHeld = true;
  miningSession = beginMining(target.key, target.type);
});
addEventListener('mouseup', (event) => {
  if (event.button !== 0 || !miningHeld) return;
  miningHeld = false;
  miningSession = cancelMining(miningSession);
  clearCracks();
});

function tick() {
  const delta = Math.min(clock.getDelta(), 0.05);
  if (gameStarted) {
    const forward = Number(keys.has('KeyW')) - Number(keys.has('KeyS'));
    const side = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
    const speed = 4.5 * delta;
    const before = camera.position.clone();
    if (forward) controls.moveForward(forward * speed);
    if (side) controls.moveRight(side * speed);
    const feet = { x: camera.position.x, y: camera.position.y - eyeHeight, z: camera.position.z };
    if (!canOccupyPlayer(world, feet)) camera.position.set(before.x, camera.position.y, before.z);

    if (grounded && keys.has('Space')) { verticalVelocity = 6.2; grounded = false; }
    verticalVelocity -= 18 * delta;
    camera.position.y += verticalVelocity * delta;
    const nextFeet = { x: camera.position.x, y: camera.position.y - eyeHeight, z: camera.position.z };
    if (!canOccupyPlayer(world, nextFeet)) {
      if (verticalVelocity <= 0) {
        camera.position.y = 1 + eyeHeight;
        grounded = true;
      } else {
        camera.position.y = before.y;
      }
      verticalVelocity = 0;
    } else grounded = false;

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
  updateDropMeshes(delta);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(tick);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
