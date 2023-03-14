// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleStarTexture = textureLoader.load('/textures/particles/11.png');
const particleAlphaTexture = textureLoader.load('/textures/particles/10.png');

/**
 * Particles
 */

// Geometry

const particleGeometry = new THREE.BufferGeometry();

const count = 2;
const positionsArray = new Float32Array(count * 3);
const colorsArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 10;
  colorsArray[i] = Math.random();
}

const positionAttrs = new THREE.BufferAttribute(positionsArray, 3);
const colorsAttrs = new THREE.BufferAttribute(colorsArray, 3);

particleGeometry.setAttribute('position', positionAttrs);
particleGeometry.setAttribute('color', colorsAttrs);

// Material
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: '#9436ff',
  alphaMap: particleAlphaTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  transparent: true,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
});

// Points

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

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
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Particles animation
  // particles.rotation.x = Math.cos(elapsedTime * 0.1) * 4;
  // particles.position.z = Math.sin(elapsedTime * 0.1) * 4;

  // for (let i = 0; i < count; i++) {
  //   const i3 = i * 3;
  //   const x = particleGeometry.attributes.position.array[i3];
  //   particleGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  // }

  // particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
