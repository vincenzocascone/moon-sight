import * as THREE from "three";
import Experience from "./Experience.js";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";

class Camera {
  private experience: Experience;
  private sizes: Sizes;
  private time: Time;
  private scene: THREE.Scene;
  private cursorX: number;
  private orientation: { x: number; y: number };
  public instance: THREE.PerspectiveCamera;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.time = this.experience.time;
    this.scene = this.experience.scene;

    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );

    this.cursorX = 0;
    this.orientation = {
      x: 0,
      y: 0,
    };

    this.setInstance();
    this.setListener();
  }

  setInstance() {
    this.instance.position.z = 10;
    this.scene.add(this.instance);
  }

  setListener() {
    if (this.sizes.width > 500) {
      window.addEventListener("mousemove", (event) => {
        this.cursorX = event.clientX / this.sizes.width - 0.5;
      });
    }

    window.addEventListener("deviceorientation", (event) => {
      this.orientation.x = ((event.gamma ?? 0) + 90) / 180 - 0.5;
      this.orientation.y = -(((event.beta ?? 0) + 180) / 360 - 0.5);
    });
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.cursorX) {
      this.instance.position.x +=
        (this.cursorX - this.instance.position.x) * 0.005 * this.time.delta;
    } else if (this.orientation.x || this.orientation.y) {
      this.instance.position.x +=
        (this.orientation.x - this.instance.position.x) *
        0.01 *
        this.time.delta;
      this.instance.position.y +=
        (this.orientation.y - this.instance.position.y) *
        0.005 *
        this.time.delta;
    }
    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }
}

export default Camera;
