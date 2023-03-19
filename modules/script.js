// @ts-nocheck
import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Resize

window.addEventListener('resize', () => {
  // Update sizes
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', (e) => {
  const fsElement = document.fullscreenElement || document.webkitFullScreenElement;

  if (!fsElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    if (canvas.webkitFullScreenElement) canvas.webkitFullScreenElement();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

// Cursor

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);

  //   console.log(cursor.x);
});

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const exGroup = new THREE.Group();
// scene.add(exGroup);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00 }),
);
// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
// );
// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
// );
// cube2.position.set(1, -0.4, 1);
// cube3.position.set(-1, 0.4, 1);

scene.add(cube1);
// exGroup.add(cube2);
// exGroup.add(cube3);

// // positions
// mesh.position.set(1, -0.4, 1);
// // mesh.position.normalize();

// scale
// exGroup.scale.set(2, 0.5, 0.5);

// rotation
// exGroup.rotation.reorder('YXZ');
// exGroup.rotation.x = Math.PI * 0.25;
// exGroup.rotation.y = Math.PI * 0.25;

// Axes helpers
const axesHelper = new THREE.AxesHelper(window.innerWidth);
scene.add(axesHelper);

/**
 * Camera
 */
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 100);
// params: FOV, aspect ratio,
// all objects less than this will be ignored, all objects greater than this will be ignored

// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1);

camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// camera.lookAt(cube1.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Time
// let time = Date.now();

// Clock
const clock = new THREE.Clock();

// Animations

// gsap.to(exGroup.position, { duration: 1, delay: 1, y: 1 });
// gsap.to(exGroup.position, { duration: 1, delay: 2, y: 0 });

const tick = () => {
  //   Update objects
  //   const currentTime = 0.00001 + Date.now();
  //   const delta = currentTime - time;
  //   time = currentTime;

  //   OrbitControl;

  // Update camera

  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * Math.PI * 2;
  //   camera.lookAt(cube1.position);

  // Update controls
  controls.update();

  // Clock
  const elapsedTime = clock.getElapsedTime();
  //   cube1.rotation.y = Math.sin(elapsedTime);
  //   camera.position.y = Math.sin(elapsedTime);
  //   camera.position.x = Math.cos(elapsedTime);

  //   Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
