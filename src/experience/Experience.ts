import * as THREE from "three";

import Camera from "./Camera";
import Renderer from "./Renderer";
import sources from "./sources";
import DebugUi from "./utils/DebugUi";
import ResourcesManager from "./utils/ResourcesManager";
import StatsPanel from "./utils/StatsPanel";
import TimeManager from "./utils/TimeManager";
import ViewportManager from "./utils/ViewportManager";
import World from "./world/World";

let instance: Experience | null = null;

export default class Experience {
  canvas: HTMLCanvasElement;
  debugUi: DebugUi;
  statsPanel: StatsPanel;
  viewportManager: ViewportManager;
  timeManager: TimeManager;
  scene: THREE.Scene;
  camera: Camera;
  resourcesManager: ResourcesManager;
  renderer: Renderer;
  world: World;

  constructor() {
    if (instance) return instance;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;

    this.debugUi = new DebugUi();
    this.statsPanel = new StatsPanel();
    this.viewportManager = new ViewportManager();
    this.timeManager = new TimeManager();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resourcesManager = new ResourcesManager(sources);
    this.renderer = new Renderer();
    this.world = new World();

    this.initializeCanvas();
    this.registerEventListeners();
  }

  initializeCanvas() {
    this.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error("Could not find or create a canvas element.");
    }
  }

  registerEventListeners() {
    this.viewportManager.on("resize", () => this.resize());
    this.timeManager.on("tick", () => this.update());
  }

  resize(): void {
    this.camera.resize();
    this.renderer.resize();
    // this.world.resize();
  }

  update(): void {
    if (this.statsPanel.active) this.statsPanel.instance?.begin();

    this.camera.update();
    this.renderer.update();

    if (this.statsPanel.active) this.statsPanel.instance?.end();
  }
}
