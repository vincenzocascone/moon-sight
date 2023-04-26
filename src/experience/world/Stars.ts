import * as THREE from "three";

import Experience from "../Experience";

export default class Stars {
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private mesh: THREE.Points;

  constructor() {
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry(): void {
    this.geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array(15000);
    const colors = new Float32Array(15000);

    for (let i = 0; i < 15000; i++) {
      const i3 = i * 3;
      const x = i3 + 0;
      const y = i3 + 1;
      const z = i3 + 2;

      vertices[x] = (Math.random() - 0.5) * 70;
      colors[x] = 0.8 + Math.random() * 0.2;

      vertices[y] = (Math.random() - 0.5) * 32;
      colors[y] = 0.8 + Math.random() * 0.2;

      vertices[z] = (Math.random() - 0.5) * 32 - 20;
      colors[z] = 0.8 + Math.random() * 0.2;
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  setMaterial(): void {
    this.material = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      vertexColors: true,
    });
  }

  setMesh(): void {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Points(this.geometry, this.material);
    scene.add(this.mesh);
  }
}
