import gsap from "gsap";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import World from "./World";
import Experience from "../Experience";

export default class PhaseText {
  private geometry!: TextGeometry;
  private material!: THREE.MeshMatcapMaterial;
  private mesh!: THREE.Mesh;

  public constructor() {
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.resize();
  }

  public updateData() {
    const { scene } = Experience.getInstance();
    const { moonData } = World.getInstance();

    if (moonData.prevPhaseName != moonData.phaseName) {
      scene.remove(this.mesh);
      this.setGeometry();
      this.setMaterial();
      this.setMesh();
      this.resize();

      gsap.fromTo(
        this.mesh.rotation,
        { x: this.mesh.rotation.x + Math.PI },
        { duration: 0.7, x: this.mesh.rotation.x + Math.PI * 2, ease: "expo" }
      );

      moonData.prevPhaseName = moonData.phaseName;
    }
  }

  public resize() {
    const { viewportManager } = Experience.getInstance();

    if (viewportManager.size.width < 420) {
      this.mesh.scale.set(0.4, 0.4, 0.4);
    } else if (viewportManager.size.width < 600) {
      this.mesh.scale.set(0.45, 0.45, 0.45);
    } else if (viewportManager.size.width < 780) {
      this.mesh.scale.set(0.6, 0.6, 0.6);
    } else if (viewportManager.size.width < 1020) {
      this.mesh.scale.set(0.75, 0.75, 0.75);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  private setGeometry() {
    const { resourcesManager } = Experience.getInstance();
    const { moonData } = World.getInstance();

    this.geometry = new TextGeometry(moonData.phaseName, {
      font: resourcesManager.items.text,
      size: 0.8,
      height: 0.2,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.02,
      bevelSegments: 4,
    });

    this.geometry.center();
  }

  private setMaterial() {
    const { resourcesManager } = Experience.getInstance();

    this.material = new THREE.MeshMatcapMaterial({
      matcap: resourcesManager.items.textMatcap,
    });
  }

  private setMesh() {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 3.2;
    this.mesh.rotation.x = Math.PI * 0.1;

    scene.add(this.mesh);
  }
}
