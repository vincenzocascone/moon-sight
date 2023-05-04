import * as THREE from "three";

import Experience from "../Experience";

export default class Moon {
  private debugFolder: any;
  private geometry!: THREE.SphereGeometry;
  private material!: THREE.MeshStandardMaterial;
  private mesh!: THREE.Mesh;

  public constructor() {
    this.setDebug();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.resize();
  }

  public resize(): void {
    const { viewportManager } = Experience.getInstance();

    if (viewportManager.size.width < 400) {
      this.mesh.scale.set(0.8, 0.8, 0.8);
    } else if (viewportManager.size.width < 600) {
      this.mesh.scale.set(0.85, 0.85, 0.85);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  private setDebug(): void {
    const { debugUi } = Experience.getInstance();

    if (debugUi.active) {
      this.debugFolder = debugUi.ui?.addFolder("Moon");
    }
  }

  private setGeometry(): void {
    this.geometry = new THREE.SphereGeometry(2, 250, 250);
  }

  private setMaterial(): void {
    const { resourcesManager } = Experience.getInstance();

    const textures = {
      color: resourcesManager.items.moonColorTexture,
      bump: resourcesManager.items.moonBumpTexture,
    };

    this.material = new THREE.MeshStandardMaterial({
      map: textures.color,
      bumpMap: textures.bump,
    });

    this.material.bumpScale = 0.04;

    this.debugFolder
      ?.add(this.material, "bumpScale")
      .min(0)
      .max(1)
      .step(0.01)
      .name("bump scale");
  }

  private setMesh(): void {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.y = 4.5;

    scene.add(this.mesh);
  }
}
