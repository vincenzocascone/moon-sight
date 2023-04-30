import * as THREE from "three";

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
    const { timeManager, viewportManager, cursorManager } =
      Experience.getInstance();

    if (cursorManager.position.x) {
      this.instance.position.x +=
        (cursorManager.position.x - this.instance.position.x) *
        0.005 *
        timeManager.delta;
    } else if (viewportManager.orientation.x || viewportManager.orientation.y) {
      this.instance.position.x +=
        (viewportManager.orientation.x - this.instance.position.x) *
        0.01 *
        timeManager.delta;
      this.instance.position.y +=
        (viewportManager.orientation.y - this.instance.position.y) *
        0.005 *
        timeManager.delta;
    }

    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
