import * as THREE from "three";
import Camera from "./Camera";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";

export default class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly scene: THREE.Scene;
  private experience: Experience;
  private sizes: Sizes;
  private camera: Camera;
  public instance: THREE.WebGLRenderer;

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.instance = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.setInstance();
  }

  private setInstance(): void {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize(): void {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update(): void {
    this.instance.render(this.scene, this.camera.instance);
  }
}
