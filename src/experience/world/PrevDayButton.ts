import gsap from "gsap";
import Hammer from "hammerjs";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Experience from "../Experience";
import EventEmitter from "../utils/EventEmitter";

export default class PrevDayButton extends EventEmitter {
  private geometry!: TextGeometry;
  private material!: THREE.MeshMatcapMaterial;
  private mesh!: THREE.Mesh;

  public constructor() {
    super();

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.registerListener();
    this.resize();
  }

  public resize(): void {
    const { viewportManager } = Experience.getInstance();
    if (viewportManager.size.width < 420) {
      this.mesh.scale.set(0.5, 0.5, 0.5);
      this.mesh.position.x = -1.3;
    } else if (viewportManager.size.width < 560) {
      this.mesh.scale.set(0.55, 0.55, 0.55);
      this.mesh.position.x = -1.5;
    } else if (viewportManager.size.width < 720) {
      this.mesh.scale.set(0.6, 0.6, 0.6);
      this.mesh.position.x = -1.8;
    } else if (viewportManager.size.width < 880) {
      this.mesh.scale.set(0.8, 0.8, 0.8);
      this.mesh.position.x = -2.2;
    } else {
      this.mesh.scale.set(1, 1, 1);
      this.mesh.position.x = -2.8;
    }
  }

  private setGeometry(): void {
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

  private setMaterial(): void {
    const { resourcesManager } = Experience.getInstance();

    this.material = new THREE.MeshMatcapMaterial({
      matcap: resourcesManager.items.textMatcap,
    });
  }

  private setMesh(): void {
    const { scene } = Experience.getInstance();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(-2.8, -3.1, 0);
    this.mesh.rotation.x = -Math.PI * 0.15;

    scene.add(this.mesh);
  }

  private registerListener(): void {
    const { camera, raycaster } = Experience.getInstance();
    window.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key == "ArrowLeft") {
        this.prevDay();
      }
    });

    window.addEventListener("click", (event: MouseEvent) => {
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera.instance);
      if (raycaster.intersectObject(this.mesh).length > 0) {
        this.prevDay();
      }
    });

    const hammertime = new Hammer(document.body);
    hammertime.on("swipe", (event) => {
      if (event.direction == 4) {
        this.prevDay();
      }
    });
  }

  private prevDay(): void {
    gsap.fromTo(
      this.mesh.rotation,
      { x: -Math.PI * 0.15 },
      { duration: 1.8, x: Math.PI - Math.PI * 0.15, ease: "elastic" }
    );
    this.trigger("prevDay");
  }
}
