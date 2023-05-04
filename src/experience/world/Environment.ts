import gsap from "gsap";
import * as THREE from "three";

import World from "./World";
import Experience from "../Experience";

export default class Environment {
  private debugFolder: any;
  private ambientLight!: THREE.AmbientLight;
  private sunLight!: THREE.DirectionalLight;

  public constructor() {
    this.setDebug();
    this.setAmbientLight();
    this.setSunLight();
    this.setSunLightPosition();
  }

  public updateData(): void {
    const { moonData } = World.getInstance();

    gsap.to(this.sunLight.position, {
      duration: 1,
      x: Math.cos(moonData.rotationDegrees) * 10,
    });
    gsap.to(this.sunLight.position, {
      duration: 1,
      z: Math.sin(moonData.rotationDegrees) * 10,
    });
  }

  private setDebug(): void {
    const { debugUi } = Experience.getInstance();

    if (debugUi.active) {
      this.debugFolder = debugUi.ui?.addFolder("Lights");
    }
  }

  private setAmbientLight(): void {
    const { scene } = Experience.getInstance();

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(this.ambientLight);

    this.debugFolder
      ?.add(this.ambientLight, "intensity")
      .min(0)
      .max(3)
      .step(0.01)
      .name("ambient light intensity");
  }

  private setSunLight(): void {
    const { scene } = Experience.getInstance();

    this.sunLight = new THREE.DirectionalLight("#ffffff", 1.35);
    this.sunLight.position.y = 0;
    scene.add(this.sunLight);

    this.debugFolder
      ?.add(this.sunLight, "intensity")
      .min(0)
      .max(5)
      .step(0.01)
      .name("sunlight intensity");
  }

  private setSunLightPosition(): void {
    const { moonData } = World.getInstance();

    this.sunLight.position.x = Math.cos(moonData.rotationDegrees) * 10;
    this.sunLight.position.z = Math.sin(moonData.rotationDegrees) * 10;
  }
}
