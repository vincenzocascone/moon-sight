import * as THREE from "three";

import config from "./config";
import Experience from "./Experience";

export default class Camera {
  instance: THREE.PerspectiveCamera;

  constructor() {
    const { viewportManager } = Experience.getInstance();

    this.instance = new THREE.PerspectiveCamera(
      45,
      viewportManager.size.width / viewportManager.size.height,
      0.1,
      100
    );

    this.setInstance();
  }

  private setInstance() {
    const { scene } = Experience.getInstance();

    this.instance.position.z = 10;
    scene.add(this.instance);
  }

  resize() {
    const { viewportManager } = Experience.getInstance();

    this.instance.aspect =
      viewportManager.size.width / viewportManager.size.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    const { timeManager, cursorManager, viewportManager } =
      Experience.getInstance();

    if (!viewportManager.isMobile) {
      this.instance.position.x +=
        (cursorManager.position.x - this.instance.position.x) *
        config.experience.camera.parallaxFactor *
        timeManager.delta;
    }

    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
