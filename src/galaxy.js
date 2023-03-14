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
 * Galaxy
 */
const params = {
  count: 100000,
  size: 0.01,
  distance: 10,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
};

let galaxyGeometry = null,
  galaxyMaterial = null,
  galaxyPoints = null;

const generateGalaxy = () => {
  console.log('generating Galaxy');

  /**
   * Destroy Old Galaxy
   */
  if (galaxyPoints !== null) {
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(galaxyPoints);
  }

  /**
   * Material
   */
  galaxyMaterial = new THREE.PointsMaterial({
    size: params.size,
    setAttribute: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Geometry
   */
  galaxyGeometry = new THREE.BufferGeometry();

  const galaxyArray = new Float32Array(params.count * 3);
  const galaxyColors = new Float32Array(params.count * 3);

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    // const randomX = (Math.random() - 0.5) * params.randomness * radius;
    // const randomY = (Math.random() - 0.5) * params.randomness * radius;
    // const randomZ = (Math.random() - 0.5) * params.randomness * radius;

    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;

    galaxyArray[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    galaxyArray[i3 + 1] = randomY;
    galaxyArray[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    galaxyColors[i3] = mixedColor.r;
    galaxyColors[i3 + 1] = mixedColor.g;
    galaxyColors[i3 + 2] = mixedColor.b;
  }
  const galaxyAttr = new THREE.BufferAttribute(galaxyArray, 3);

  galaxyGeometry.setAttribute('position', galaxyAttr);
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  /**
   * Mesh
   */

  galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxyPoints);
};

generateGalaxy();

gui.add(params, 'count', 100, 100000, 100).onFinishChange(() => generateGalaxy());
gui.add(params, 'size', 0.001, 5, 0.001).onFinishChange(() => generateGalaxy());
gui.add(params, 'distance', 0, 50, 1).onFinishChange(() => generateGalaxy());
gui.add(params, 'radius', 0.01, 20, 0.01).onFinishChange(() => generateGalaxy());
gui.add(params, 'branches', 2, 20, 1).onFinishChange(() => generateGalaxy());
gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(() => generateGalaxy());
gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(() => generateGalaxy());
gui.addColor(params, 'insideColor').onFinishChange(() => generateGalaxy());
gui.addColor(params, 'outsideColor').onFinishChange(() => generateGalaxy());

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
camera.position.x = 3;
camera.position.y = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
