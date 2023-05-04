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
