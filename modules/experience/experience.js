// @ts-nocheck

import * as THREE from 'three';
import gsap from 'gsap';

import Sizes from './utils/sizes';
import Time from './utils/time';
import Camera from './camera';
import Renderer from './renderer';
import World from './world/world';
import Resources from './utils/resources';
import sources from './sources';
import Debug from './utils/debug';

let instance = null;

export class Experience {
  constructor(canvas) {
    if (instance) return instance;

    instance = this;

    // Global access
    window.experience = this;
    this.canvas = canvas;

    // Options
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(this);
    this.renderer = new Renderer();
    this.world = new World();

    // Resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    // Traverse the whole scene

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mash) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
