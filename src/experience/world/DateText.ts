import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import World from "./World";
import Experience from "../Experience";

export default class DateText {
  private geometry: TextGeometry;
  private material: THREE.MeshMatcapMaterial;
  private mesh: THREE.Mesh;

  constructor() {
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.resize();
  }

  private setGeometry(): void {
    const { resourcesManager } = Experience.getInstance();
    const { moonData } = World.getInstance();

    this.geometry = new TextGeometry(moonData.fullDate, {
      font: resourcesManager.items.text,
      size: 0.5,
      height: 0.2,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 3,
    });

    this.geometry.center();
  }

  private setMaterial(): void {
    const { resourcesManager } = Experience.getInstance();

    this.material = new THREE.MeshMatcapMaterial({
      matcap: resourcesManager.items.textMatcap,
    });
  }

  private setMesh(): void {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = -3.1;
    this.mesh.rotation.x = -Math.PI * 0.15;
    scene.add(this.mesh);
  }

  public updateData(): void {
    const { scene } = Experience.getInstance();

    scene.remove(this.mesh);
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.resize();
  }

  resize(): void {
    const { viewportManager } = Experience.getInstance();

    if (viewportManager.viewport.size.width < 420) {
      this.mesh.scale.set(0.5, 0.5, 0.5);
    } else if (viewportManager.viewport.size.width < 560) {
      this.mesh.scale.set(0.55, 0.55, 0.55);
    } else if (viewportManager.viewport.size.width < 720) {
      this.mesh.scale.set(0.6, 0.6, 0.6);
    } else if (viewportManager.viewport.size.width < 880) {
      this.mesh.scale.set(0.8, 0.8, 0.8);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }
}
