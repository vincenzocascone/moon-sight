import gsap from "gsap";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Experience from "../Experience";
import EventEmitter from "../Utils/EventEmitter";

export default class PrevDayButton extends EventEmitter {
  geometry: TextGeometry;
  material: THREE.MeshMatcapMaterial;
  mesh: THREE.Mesh;

  constructor() {
    super();

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setListener();
    this.resize();
  }

  setGeometry(): void {
    const { resourcesManager } = Experience.getInstance();

    this.geometry = new TextGeometry("<<", {
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

  setMaterial(): void {
    const { resourcesManager } = Experience.getInstance();

    this.material = new THREE.MeshMatcapMaterial({
      matcap: resourcesManager.items.textMatcap,
    });
  }

  setMesh(): void {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(-2.8, -3.1, 0);
    this.mesh.rotation.x = -Math.PI * 0.15;

    scene.add(this.mesh);
  }

  setListener(): void {
    const { camera, raycaster } = Experience.getInstance();
    // Arrow keys
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key == "ArrowLeft") {
        this.prevDay();
      }
    });

    // Click on arrows
    window.addEventListener("click", (event: MouseEvent) => {
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera.instance);
      if (raycaster.intersectObject(this.mesh).length > 0) {
        this.prevDay();
      }
    });

    // Mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    window.addEventListener("touchstart", (event: TouchEvent) => {
      touchStartX = event.changedTouches[0].screenX;
    });
    window.addEventListener("touchend", (event: TouchEvent) => {
      touchEndX = event.changedTouches[0].screenX;
      if (touchEndX > touchStartX) {
        this.prevDay();
      }
    });
  }

  prevDay(): void {
    gsap.fromTo(
      this.mesh.rotation,
      { x: -Math.PI * 0.15 },
      { duration: 1.8, x: Math.PI - Math.PI * 0.15, ease: "elastic" }
    );
    this.trigger("prevDay");
  }

  resize(): void {
    const { viewportManager } = Experience.getInstance();
    if (viewportManager.viewport.size.width < 420) {
      this.mesh.scale.set(0.5, 0.5, 0.5);
      this.mesh.position.x = -1.3;
    } else if (viewportManager.viewport.size.width < 560) {
      this.mesh.scale.set(0.55, 0.55, 0.55);
      this.mesh.position.x = -1.5;
    } else if (viewportManager.viewport.size.width < 720) {
      this.mesh.scale.set(0.6, 0.6, 0.6);
      this.mesh.position.x = -1.8;
    } else if (viewportManager.viewport.size.width < 880) {
      this.mesh.scale.set(0.8, 0.8, 0.8);
      this.mesh.position.x = -2.2;
    } else {
      this.mesh.scale.set(1, 1, 1);
      this.mesh.position.x = -2.8;
    }
  }
}
