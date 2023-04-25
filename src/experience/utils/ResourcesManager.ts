import gsap from "gsap";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import EventEmitter from "./EventEmitter";
import Experience from "../Experience";

export enum SourceType {
  Texture = "texture",
  Font = "font",
}

export interface Source {
  type: SourceType;
  path: string;
  name: string;
}

interface Loaders {
  textureLoader: THREE.TextureLoader;
  fontLoader: FontLoader;
}

export default class ResourcesManager extends EventEmitter {
  private readonly _sources: Source[];
  private _overlay: THREE.Mesh;
  private _loaders: Loaders;
  readonly items: Record<string, any>;

  constructor(sources: Source[]) {
    super();

    this._sources = sources;
    this.items = {};

    this.setOverlay();
    this.setLoaders();
    this.startLoading();
  }

  private setOverlay() {
    const { camera, scene } = Experience.getInstance();
    const overlayGeometry = new THREE.PlaneGeometry(100, 100);
    const overlayMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
    });
    this._overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    this._overlay.position.z = camera.instance.position.z - 0.4;
    scene.add(this._overlay);
  }

  private setLoaders() {
    const loadingBarElement = document.getElementById(
      "loading-bar"
    ) as HTMLElement;

    const loadingManager = new THREE.LoadingManager(
      () => {
        this.trigger("ready");

        gsap.to(this._overlay.material, { duration: 3, opacity: 0, delay: 1 });

        gsap.delayedCall(1, () => {
          loadingBarElement.classList.add("ended");
          loadingBarElement.style.transform = "";
        });
      },
      // @ts-ignore
      (itemUrl, itemsLoaded, itemsTotal) => {
        loadingBarElement.style.transform = `scaleX(${
          itemsLoaded / itemsTotal
        })`;
      },
      (error) => {
        console.error(error);
      }
    );

    this._loaders = {
      textureLoader: new THREE.TextureLoader(loadingManager),
      fontLoader: new FontLoader(loadingManager),
    };
  }

  private startLoading() {
    for (const source of this._sources) {
      if (source.type === SourceType.Texture) {
        this._loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === SourceType.Font) {
        this._loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  private sourceLoaded(source: Source, file: any) {
    this.items[source.name] = file;
  }
}
