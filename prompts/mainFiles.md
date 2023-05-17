Here are the main files of the project:

package.json file:
```json
{
  "name": "moon-sight",
  "private": true,
  "version": "1.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@types/node": "^18.15.11",
    "@types/three": "^0.150.2",
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "@typescript-eslint/parser": "^5.59.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "postcss": "^8.4.22",
    "prettier": "^2.8.7",
    "prettier-plugin-tailwindcss": "^0.3.0",
    "sass": "^1.62.0",
    "tailwindcss": "^3.3.1",
    "typescript": "^4.9.3",
    "vite": "^4.2.0"
  },
  "dependencies": {
    "@types/hammerjs": "^2.0.41",
    "dayjs": "^1.11.7",
    "gsap": "^3.11.5",
    "hammerjs": "^2.0.8",
    "lil-gui": "^0.18.1",
    "postprocessing": "^6.31.0",
    "stats.js": "^0.17.0",
    "three": "^0.151.3"
  }
}
```

Experience.ts file:

```typescript
import * as THREE from "three";

import Camera from "./Camera";
import config from "./config";
import Renderer from "./Renderer";
import CursorManager from "./utils/CursorManager";
import DebugUi from "./utils/DebugUi";
import ResourcesManager from "./utils/ResourcesManager";
import StatsPanel from "./utils/StatsPanel";
import TimeManager from "./utils/TimeManager";
import ViewportManager from "./utils/ViewportManager";
import World from "./world/World";

export default class Experience {
  private static instance: Experience;
  public canvas!: HTMLCanvasElement;
  public debugUi!: DebugUi;
  public statsPanel!: StatsPanel;
  public viewportManager!: ViewportManager;
  public cursorManager!: CursorManager;
  public timeManager!: TimeManager;
  public scene!: THREE.Scene;
  public camera!: Camera;
  public resourcesManager!: ResourcesManager;
  public renderer!: Renderer;
  public world!: World;
  public raycaster!: THREE.Raycaster;

  public constructor() {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    this.initializeCanvas();

    this.debugUi = new DebugUi(config.utils.debugUi);
    this.statsPanel = new StatsPanel(config.utils.statsPanel);
    this.viewportManager = new ViewportManager(config.utils.viewportManager);
    this.cursorManager = new CursorManager();
    this.timeManager = new TimeManager();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resourcesManager = new ResourcesManager(config.utils.resourcesManager);
    this.renderer = new Renderer();
    this.raycaster = new THREE.Raycaster();
    this.world = World.getInstance();

    this.registerEventListeners();
  }

  public static getInstance(): Experience {
    if (!Experience.instance) {
      Experience.instance = new Experience();
    }
    return Experience.instance;
  }

  private initializeCanvas() {
    this.canvas = document.getElementById(
      config.canvasElementId
    ) as HTMLCanvasElement;

    if (!this.canvas) {
      throw new Error("Canvas not found.");
    }
  }

  private registerEventListeners() {
    this.viewportManager.on("resize", () => this.resize());
    this.timeManager.on("tick", () => this.update());
  }

  private resize(): void {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  private update(): void {
    if (this.viewportManager.isVisible) {
      if (this.statsPanel.active) this.statsPanel.instance?.begin();

      this.camera.update();
      this.renderer.update();

      if (this.statsPanel.active) this.statsPanel.instance?.end();
    }
  }
}
```

Renderer.ts file:

```typescript
import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  public instance: THREE.WebGL1Renderer;

  public constructor() {
    const { canvas } = Experience.getInstance();

    this.instance = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });

    this.resize();
  }

  public resize(): void {
    const { viewportManager } = Experience.getInstance();

    this.instance.setSize(
      viewportManager.size.width,
      viewportManager.size.height
    );
    this.instance.setPixelRatio(viewportManager.pixelRatio);
  }

  public update(): void {
    const { scene, camera } = Experience.getInstance();
    this.instance.render(scene, camera.instance);
  }
}
```

Camera.ts file:

```typescript
import * as THREE from "three";

import Experience from "./Experience";

interface CameraConfig {
  parallaxFactor: number;
}

export default class Camera {
  public instance!: THREE.PerspectiveCamera;
  private config: CameraConfig;

  public constructor(config: CameraConfig = { parallaxFactor: 0.005 }) {
    this.config = config;

    this.setInstance();
  }

  public resize() {
    const { viewportManager } = Experience.getInstance();

    this.instance.aspect =
      viewportManager.size.width / viewportManager.size.height;
    this.instance.updateProjectionMatrix();
  }

  public update() {
    const { timeManager, cursorManager, viewportManager } =
      Experience.getInstance();

    if (!viewportManager.isMobile) {
      this.instance.position.x +=
        (cursorManager.position.x - this.instance.position.x) *
        this.config.parallaxFactor *
        timeManager.delta;
    }

    this.instance.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private setInstance() {
    const { scene, viewportManager } = Experience.getInstance();

    this.instance = new THREE.PerspectiveCamera(
      45,
      viewportManager.size.width / viewportManager.size.height,
      0.1,
      100
    );

    this.instance.position.z = 10;
    scene.add(this.instance);
  }
}
```

ResourcesManager.ts file:

```typescript
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
```

World.ts file:

```typescript
import DateText from "./DateText";
import Environment from "./Environment";
import Moon from "./Moon";
import NextDayButton from "./NextDayButton";
import PhaseManager from "./PhaseManager";
import PhaseText from "./PhaseText";
import PrevDayButton from "./PrevDayButton";
import Stars from "./Stars";
import Experience from "../Experience";

export default class World {
  private static instance: World;
  public moonData!: PhaseManager;
  public moon!: Moon;
  public phaseText!: PhaseText;
  public dateText!: DateText;
  public nextDayButton!: NextDayButton;
  public prevDayButton!: PrevDayButton;
  public stars!: Stars;
  public environment!: Environment;

  private constructor() {
    if (World.instance) {
      return World.instance;
    }
    World.instance = this;

    const { resourcesManager } = Experience.getInstance();

    this.moonData = new PhaseManager();

    resourcesManager.on("ready", () => {
      this.moon = new Moon();
      this.phaseText = new PhaseText();
      this.dateText = new DateText();
      this.nextDayButton = new NextDayButton();
      this.prevDayButton = new PrevDayButton();
      this.stars = new Stars();
      this.environment = new Environment();

      this.moonData.on("newDate", () => {
        this.updateData();
      });
      this.prevDayButton.on("prevDay", () => {
        this.prevDay();
      });
      this.nextDayButton.on("nextDay", () => {
        this.nextDay();
      });
    });
  }

  public static getInstance(): World {
    if (!World.instance) {
      World.instance = new World();
    }
    return World.instance;
  }

  public resize(): void {
    this.phaseText?.resize();
    this.dateText?.resize();
    this.moon?.resize();
    this.prevDayButton?.resize();
    this.nextDayButton?.resize();
  }

  private updateData(): void {
    this.phaseText?.updateData();
    this.environment?.updateData();
    this.dateText?.updateData();
  }

  private nextDay(): void {
    this.moonData?.nextDay();
    this.updateData();
  }

  private prevDay(): void {
    this.moonData?.prevDay();
    this.updateData();
  }
}
```

PhaseText.ts file:

```typescript
[](../src/experience/world/PhaseText.ts)
```
