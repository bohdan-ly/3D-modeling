import * as dat from 'lil-gui';

export default class Debug {
  constructor() {
    // Setup
    this.active = window.location.pathname.includes('debug');

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}
