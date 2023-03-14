// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color('#00e3f9');
ambientLight.intensity = 0.5;

const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionLight.position.set(1, 1, 0);

const hemisphereLight = new THREE.HemisphereLight(0x00d8ff, 0x00f800, 0.5);

const pointLight = new THREE.PointLight(0xff7100, 0.5, 10, 2);

const rectAreaLight = new THREE.RectAreaLight(0xff00e4, 2, 1, 1);
rectAreaLight.position.set(1, 1, 0);
rectAreaLight.lookAt(new THREE.Vector3());

const spotLight = new THREE.SpotLight(0xfe355a, 1, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
scene.add(spotLight.target);

gui.add(ambientLight, 'intensity', 0, 1, 0.001);
gui.add(directionLight, 'intensity', 0, 1, 0.001);
gui.add(spotLight.target.position, 'x', -1, 2, 0.001);
gui.add(spotLight.target.position, 'y', -1, 2, 0.001);
gui.add(spotLight.target.position, 'z', -1, 2, 0.001);

scene.add(ambientLight, pointLight, spotLight);

// Helpers

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(directionLight, 0.2);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(directionLight, 0.2);
scene.add(pointLightHelper);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
const grassMaterial = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
grassMaterial.color.set('#008100');
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
