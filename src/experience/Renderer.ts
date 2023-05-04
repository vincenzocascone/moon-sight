import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  public instance: THREE.WebGL1Renderer;

  public constructor() {
    const { canvas } = Experience.getInstance();

    this.instance = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });

    this.resize();
  }

  public resize(): void {
    const { viewportManager } = Experience.getInstance();

    this.instance.setSize(
      viewportManager.size.width,
      viewportManager.size.height
    );
    this.instance.setPixelRatio(viewportManager.pixelRatio);
  }

  public update(): void {
    const { scene, camera } = Experience.getInstance();
    this.instance.render(scene, camera.instance);
  }
}
