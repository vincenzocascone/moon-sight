import * as THREE from "three";

import Experience from "./Experience";

interface CameraConfig {
  parallaxFactor: number;
}

export default class Camera {
  public instance!: THREE.PerspectiveCamera;
  private config: CameraConfig;

  public constructor(config: CameraConfig = { parallaxFactor: 0.005 }) {
    this.config = config;

    this.setInstance();
  }

  public resize() {
    const { viewportManager } = Experience.getInstance();

    this.instance.aspect =
      viewportManager.size.width / viewportManager.size.height;
    this.instance.updateProjectionMatrix();
  }

  public update() {
    const { timeManager, cursorManager, viewportManager } =
      Experience.getInstance();

    if (!viewportManager.isMobile) {
      this.instance.position.x +=
        (cursorManager.position.x - this.instance.position.x) *
        this.config.parallaxFactor *
        timeManager.delta;
    }

    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private setInstance() {
    const { scene, viewportManager } = Experience.getInstance();

    this.instance = new THREE.PerspectiveCamera(
      45,
      viewportManager.size.width / viewportManager.size.height,
      0.1,
      100
    );

    this.instance.position.z = 10;
    scene.add(this.instance);
  }
}
