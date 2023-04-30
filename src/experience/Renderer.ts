import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  instance: THREE.WebGL1Renderer;

  constructor() {
    const { canvas } = Experience.getInstance();

    this.instance = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });

    this.resize();
  }

  resize(): void {
    const { viewportManager } = Experience.getInstance();

    this.instance.setSize(
      viewportManager.viewport.size.width,
      viewportManager.viewport.size.height
    );
    this.instance.setPixelRatio(viewportManager.viewport.pixelRatio);
  }

  update(): void {
    const { scene, camera } = Experience.getInstance();
    this.instance.render(scene, camera.instance);
  }
}
