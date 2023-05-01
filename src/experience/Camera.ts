import * as THREE from "three";

import Experience from "./Experience";

interface CameraConfig {
  parallaxFactor: number;
}

export default class Camera {
  private _config: CameraConfig;
  instance: THREE.PerspectiveCamera;

  constructor(config: CameraConfig = { parallaxFactor: 0.005 }) {
    const { viewportManager } = Experience.getInstance();

    this._config = config;

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
        this._config.parallaxFactor *
        timeManager.delta;
    }

    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
