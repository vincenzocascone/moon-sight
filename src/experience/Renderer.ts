import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  instance: THREE.WebGLRenderer;

  constructor() {
    const { canvas } = new Experience();

    this.instance = new THREE.WebGL1Renderer({
      canvas: canvas,
      antialias: true,
    });

    this.resize();
  }

  resize(): void {
    const { viewportManager } = new Experience();

    this.instance.setSize(
      viewportManager.viewport.size.width,
      viewportManager.viewport.size.height
    );
    this.instance.setPixelRatio(viewportManager.viewport.pixelRatio);
  }

  update(): void {
    const { scene, camera } = new Experience();

    this.instance.render(scene, camera.instance);
  }
}
