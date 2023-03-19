// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Loaders
 */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
const cuberTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */

const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cuberTextureLoader.load([
  '/textures/environmentMaps/00/px.jpg',
  '/textures/environmentMaps/00/nx.jpg',
  '/textures/environmentMaps/00/py.jpg',
  '/textures/environmentMaps/00/ny.jpg',
  '/textures/environmentMaps/00/pz.jpg',
  '/textures/environmentMaps/00/nz.jpg',
]);

environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 3;
gui.add(debugObject, 'envMapIntensity', 0, 10, 0.01).onChange(updateAllMaterials);

/**
 * Models
 */

gltfLoader.load(
  // '/models/FlightHelmet/glTF/FlightHelmet.gltf', 
  '/models/hamburger.glb', 
  (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  // gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.01).name('modelRotation');

  updateAllMaterials();
});

/**
 * Lights
 */

const directionLight = new THREE.DirectionalLight('#fff', 3);
directionLight.position.set(0.25, 3, -2.25);
directionLight.castShadow = true;
directionLight.shadow.camera.far = 15;
directionLight.shadow.mapSize.set(1024, 1024);
directionLight.shadow.normalBias = 0.05;
scene.add(directionLight);

gui.add(directionLight, 'intensity', 0, 10, 0.01).name('lightIntensity');
gui.add(directionLight.position, 'x', -5, 5, 0.01).name('lightX');
gui.add(directionLight.position, 'y', -5, 5, 0.01).name('lightY');
gui.add(directionLight.position, 'z', -5, 5, 0.01).name('lightZ');

const directionLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera);
scene.add(directionLightCameraHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACES: THREE.ACESFilmicToneMapping,
});
gui.add(renderer, 'toneMappingExposure', 0, 10, 0.01);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
