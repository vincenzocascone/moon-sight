import gsap from "gsap";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import DevConsole from "./DevConsole";
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

interface ResourcesManagerConfig {
  sources: Source[];
  loaderElementId?: string;
}

export default class ResourcesManager extends EventEmitter {
  public readonly items: Record<string, any>;
  private readonly loaderElement?: HTMLElement;
  private config: ResourcesManagerConfig;
  private overlay!: THREE.Mesh;
  private loaders!: Loaders;

  public constructor(config: { sources: Source[]; loaderElementId?: string }) {
    super();

    this.config = config;

    if (this.config.loaderElementId) {
      this.loaderElement = document.getElementById(
        this.config.loaderElementId
      )!;
    }

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
    this.overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    this.overlay.position.z = camera.instance.position.z - 0.4;
    scene.add(this.overlay);
  }

  private setLoaders() {
    const { scene } = Experience.getInstance();

    const loadingManager = new THREE.LoadingManager(
      () => {
        this.trigger("ready");

        gsap.to(this.overlay.material, { duration: 3, opacity: 0, delay: 1 });

        gsap.delayedCall(1, () => {
          if (this.loaderElement) {
            this.loaderElement.classList.add("ended");
            this.loaderElement.style.transform = "";
          }
          scene.remove(this.overlay);
        });
      },
      (itemUrl, itemsLoaded, itemsTotal) => {
        DevConsole.log(
          `Loading file: ${itemUrl}. Loaded ${itemsLoaded} of ${itemsTotal}`
        );
        if (this.loaderElement) {
          this.loaderElement.style.transform = `scaleX(${
            itemsLoaded / itemsTotal
          })`;
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.loaders = {
      textureLoader: new THREE.TextureLoader(loadingManager),
      fontLoader: new FontLoader(loadingManager),
    };
  }

  private startLoading() {
    for (const source of this.config.sources) {
      if (source.type === SourceType.Texture) {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === SourceType.Font) {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  private sourceLoaded(source: Source, file: any) {
    this.items[source.name] = file;
  }
}
