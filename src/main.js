import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { canOccupyPlayer, createIsland } from './world.js';

const game = document.querySelector('#game');
const startButton = document.querySelector('#start');
const statusLabel = document.querySelector('#status');
const helpLabel = document.querySelector('#help');
const world = createIsland();
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
const meshes = [];
for (const type of ['grass', 'dirt', 'stone', 'log', 'leaves']) {
  const entries = [...world.entries()].filter(([, blockType]) => blockType === type);
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
  if (event.code === 'Space') event.preventDefault();
});
addEventListener('keyup', (event) => keys.delete(event.code));

const raycaster = new THREE.Raycaster();
const look = new THREE.Vector3();
const clock = new THREE.Clock();
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

    controls.getDirection(look);
    raycaster.set(camera.position, look);
    raycaster.far = 5;
    const hit = raycaster.intersectObjects(meshes, false)[0];
    if (hit) statusLabel.textContent = 'Look around · Mining arrives next';
  }
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(tick);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
