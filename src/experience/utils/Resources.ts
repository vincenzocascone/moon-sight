import * as THREE from "three";
import gsap from "gsap";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import Camera from "../Camera";
import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

interface Source {
  type: string;
  path: string;
  name: string;
}

interface Loaders {
  textureLoader: THREE.TextureLoader;
  fontLoader: FontLoader;
}

export default class Resources extends EventEmitter {
  readonly sources: Source[];
  readonly items: Record<string, any>;
  readonly overlayGeometry: THREE.PlaneGeometry;
  readonly overlayMaterial: THREE.MeshBasicMaterial;
  readonly overlayMesh: THREE.Mesh;
  readonly loadingManager: THREE.LoadingManager;
  private experience: Experience;
  private camera: Camera;
  private scene: THREE.Scene;
  private loadingBarElement: HTMLElement;
  private loaders: Loaders;

  constructor(sources: Source[]) {
    super();

    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.sources = sources;
    this.items = {};

    this.overlayGeometry = new THREE.PlaneGeometry(100, 100);
    this.overlayMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
    });
    this.overlayMesh = new THREE.Mesh(
      this.overlayGeometry,
      this.overlayMaterial
    );

    this.loadingBarElement = document.querySelector(
      ".loading-bar"
    ) as HTMLElement;

    this.loadingManager = new THREE.LoadingManager(
      () => {
        this.trigger("ready");

        gsap.to(this.overlayMaterial, { duration: 3, opacity: 0, delay: 1 });

        gsap.delayedCall(1, () => {
          this.loadingBarElement.classList.add("ended");
          this.loadingBarElement.style.transform = "";
        });
      },
      (itemUrl, itemsLoaded, itemsTotal) => {
        console.log(itemUrl);
        this.loadingBarElement.style.transform = `scaleX(${
          itemsLoaded / itemsTotal
        })`;
      },
      (error) => {
        console.log(error);
      }
    );

    this.loaders = {
      textureLoader: new THREE.TextureLoader(this.loadingManager),
      fontLoader: new FontLoader(this.loadingManager),
    };

    this.setOverlay();
    this.startLoading();
  }

  setOverlay() {
    this.overlayMesh.position.z = this.camera.instance.position.z - 0.4;
    this.scene.add(this.overlayMesh);
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
      if (source.type === "font") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: Source, file: any) {
    this.items[source.name] = file;
  }
}
