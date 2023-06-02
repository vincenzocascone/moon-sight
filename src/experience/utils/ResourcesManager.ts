import gsap from "gsap";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import DevConsole from "./DevConsole";
import EventEmitter from "./EventEmitter";

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
  loadingPercentageElementId?: string;
  loadingOverlayElementId?: string;
}

export default class ResourcesManager extends EventEmitter {
  public readonly items: Record<string, any>;
  private readonly loadingPercentageElement?: HTMLElement;
  private readonly loadingOverlayElement?: HTMLElement;
  private config: ResourcesManagerConfig;
  private loaders!: Loaders;

  public constructor(config: { sources: Source[]; loaderElementId?: string }) {
    super();

    this.config = config;

    this.items = {};

    if (this.config.loadingPercentageElementId) {
      this.loadingPercentageElement = document.getElementById(
        this.config.loadingPercentageElementId
      )!;
    }

    if (this.config.loadingOverlayElementId) {
      this.loadingOverlayElement = document.getElementById(
        this.config.loadingOverlayElementId
      )!;
    }

    this.setLoaders();
    this.startLoading();
  }

  private setLoaders() {
    const loadingManager = new THREE.LoadingManager(
      () => {
        this.trigger("ready");

        if (this.loadingOverlayElement) {
          gsap.to(this.loadingOverlayElement, {
            duration: 2,
            opacity: 0,
            onComplete: () => {
              this.loadingOverlayElement!.remove();
            },
          });
        }
      },
      async (itemUrl, itemsLoaded, itemsTotal) => {
        DevConsole.log(
          `Loading file: ${itemUrl}. Loaded ${itemsLoaded} of ${itemsTotal}`
        );

        if (this.loadingPercentageElement) {
          let displayedPercentage =
            parseInt(this.loadingPercentageElement.innerHTML) || 0;
          const realPercentage = Math.round((itemsLoaded / itemsTotal) * 100);

          while (displayedPercentage < realPercentage) {
            displayedPercentage += 1;
            this.loadingPercentageElement.innerHTML = `${displayedPercentage}%`;
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
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
