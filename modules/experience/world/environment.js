// @ts-nocheck
import * as THREE from 'three';

import { Experience } from '../experience';

export default class Environment {
  constructor() {
    // Setup
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('Environment');
    }

    this.setSunlight();
    this.setEnvironmentMap();
  }

  setSunlight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, -2.25);
    this.scene.add(this.sunLight);

    // Debug

    if (this.debug.active) {
      this.debugFolder.add(this.sunLight, 'intensity', 0, 10, 0.01).name('sunLightIntensity');
      this.debugFolder.add(this.sunLight.position, 'x', -5, 5, 0.01).name('sunLightX');
      this.debugFolder.add(this.sunLight.position, 'y', -5, 5, 0.01).name('sunLightY');
      this.debugFolder.add(this.sunLight.position, 'z', -5, 5, 0.01).name('sunLightZ');
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.environmentMap.updateMaterials();

    // Debug

    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity', 0, 4, 0.01)
        .name('envIntensity')
        .onChange(() => this.environmentMap.updateMaterials());
    }
  }
}
