// @ts-nocheck
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

/**
 * Add comment
 */

const commentForm = document.querySelector('.comment-form');
const sentBtn = document.querySelector('button[type=submit]');
const comments = document.querySelector('div.max-w-2xl');

String.prototype.escape = function () {
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return this.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

const onSentMessage = (event) => {
  event.preventDefault();
  const message = event.target[0].value;
  const value = message.escape();
  // const value = message;
  console.log(value);

  const newComment = document.createElement('article');
  newComment.classList = 'p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900';
  newComment.innerHTML = `
  <footer class="flex justify-between items-center mb-2">
  <div class="flex items-center">
      <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"><img
              class="mr-2 w-6 h-6 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-4.jpg"
              alt="Helene Engels">Helene Engels</p>
      <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-06-23"
              title="June 23rd, 2022">Jun. 23, 2022</time></p>
  </div>
  <button id="dropdownComment4Button" data-dropdown-toggle="dropdownComment4"
      class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      type="button">
      <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
              d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">
          </path>
      </svg>
  </button>
  <!-- Dropdown menu -->
  <div id="dropdownComment4"
      class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
      <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownMenuIconHorizontalButton">
          <li>
              <a href="#"
                  class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
          </li>
          <li>
              <a href="#"
                  class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
          </li>
          <li>
              <a href="#"
                  class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
          </li>
      </ul>
  </div>
</footer>
<p class="text-gray-500 dark:text-gray-400">${value}</p>
<div class="flex items-center mt-4 space-x-4">
  <button type="button"
      class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
      <svg aria-hidden="true" class="mr-1 w-4 h-4" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
          </path>
      </svg>
      Reply
  </button>
</div>`;
  comments.appendChild(newComment);
  commentForm.after(newComment);
  event.target[0].value = '';
};

commentForm.addEventListener('submit', onSentMessage);

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar');
let sceneReady = false;
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });

      // Update loadingBarElement
      loadingBarElement.classList.add('ended');
      loadingBarElement.style.transform = '';
    }, 500);

    window.setTimeout(() => {
      sceneReady = true;
    }, 3000);
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progress = Math.round((itemsLoaded / itemsTotal) * 100) / 100;
    loadingBarElement.style.transform = `translate(-50%, -50%) scaleX(${progress})`;
  },
);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

/**
 * Base
 */
// Debug
const debugObject = {};

// Canvas
const canvas = document.getElementById('webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      // child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
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

debugObject.envMapIntensity = 2.5;

/**
 * Models
 */
let gltfModel = null;

gltfLoader.load('/models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  gltfModel = gltf;
  gltfModel.scene.scale.set(2.5, 2.5, 2.5);
  gltfModel.scene.rotation.y = Math.PI * 0.8;
  // gltfModel.scene.rotation.y = Math.PI * 0.5;
  gltfModel.scene.position.z = -2;
  gltfModel.scene.position.x = -1.5;
  scene.add(gltfModel.scene);

  updateAllMaterials();
});

/**
 * Points of interest
 */

const raycaster = new THREE.Raycaster();
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point-0'),
  },
  {
    position: new THREE.Vector3(0.5, 0.8, -1.6),
    element: document.querySelector('.point-1'),
  },
  {
    position: new THREE.Vector3(1.6, -1.3, -0.7),
    element: document.querySelector('.point-2'),
  },
];

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

  // Go through each points
  if (sceneReady) {
    points.forEach((point) => {
      const screenPosition = point.position.clone();
      screenPosition.project(camera);

      raycaster.setFromCamera(screenPosition, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);

      if (!intersects.length) {
        point.element.classList.add('visible');
      } else {
        const intersectionDistance = intersects[0].distance;
        const pointDistance = point.position.distanceTo(camera.position);
        if (pointDistance > intersectionDistance) {
          point.element.classList.remove('visible');
        } else {
          point.element.classList.add('visible');
        }
      }

      const translateX = screenPosition.x * sizes.width * 0.5;
      const translateY = -screenPosition.y * sizes.height * 0.5;

      point.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  }
  if (gltfModel) {
    gltfModel.scene.position.z = Math.sin(elapsedTime * 0.2) * 0.1 - 2;
    gltfModel.scene.position.x = Math.cos(elapsedTime * 0.2) * 0.5 - 1.5;
  }
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
