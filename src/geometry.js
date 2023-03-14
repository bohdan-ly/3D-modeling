// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';

console.log(Image);

/**
 * Texture
 */
// const image = new Image();

// const texture = new THREE.Texture(image);

// image.onload = () => {
//   texture.needsUpdate = true;
// };

// image.src = '/door.jpg';

const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log('onStart');
// };

// loadingManager.onLoaded = () => {
//   console.log('onLoaded');
// };
// loadingManager.onProgress = () => {
//   console.log('onProgress');
// };

// loadingManager.onError = () => {
//   console.log('onError');
// };

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load('/textures/minecraft.png');

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

/**
 * GUI
 */

const gui = new dat.GUI();

const params = {
  color: '#622222',
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};

gui.addColor(params, 'color').onChange(() => {
  material.color.set(params.color);
});

gui.add(params, 'spin');

/**
 * Base
 */
// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

// Object

// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

// const positionAttrs = new THREE.BufferAttribute(positionsArray, 3);

// const geometry = new THREE.SphereGeometry(1);

// const count = 500;
// const positionsArray = new Float32Array(count * 3 * 3);

// for (let i = 0; i < count; i++) {
//   positionsArray[i] = Math.random() - 0.5;
// }

// const positionAttrs = new THREE.BufferAttribute(positionsArray, 3);

// geometry.setAttribute('position', positionAttrs);

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug

gui.add(mesh.position, 'y', -3, 3, 0.01);
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
