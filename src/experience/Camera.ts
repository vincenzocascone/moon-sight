import * as THREE from "three";

import Experience from "./Experience.js";

export default class Camera {
  instance: THREE.PerspectiveCamera;

  constructor() {
    const { viewportManager } = Experience.getInstance();

    this.instance = new THREE.PerspectiveCamera(
      45,
      viewportManager.viewport.size.width /
        viewportManager.viewport.size.height,
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
      viewportManager.viewport.size.width /
      viewportManager.viewport.size.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    const { timeManager, viewportManager } = Experience.getInstance();

    if (viewportManager.cursor.position.x) {
      this.instance.position.x +=
        (viewportManager.cursor.position.x - this.instance.position.x) *
        0.005 *
        timeManager.delta;
    } else if (
      viewportManager.viewport.orientation.x ||
      viewportManager.viewport.orientation.y
    ) {
      this.instance.position.x +=
        (viewportManager.viewport.orientation.x - this.instance.position.x) *
        0.01 *
        timeManager.delta;
      this.instance.position.y +=
        (viewportManager.viewport.orientation.y - this.instance.position.y) *
        0.005 *
        timeManager.delta;
    }
    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
