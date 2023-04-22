import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Resources from "./utils/Resources";
import Debug from "./utils/Debug";
import Stats from "./utils/Stats";
import sources from "./sources";

let instance: Experience | null = null;

export default class Experience {
  public canvas: HTMLCanvasElement;
  public debug: Debug;
  public stats: Stats;
  public sizes: Sizes;
  public time: Time;
  public scene: THREE.Scene;
  public camera: Camera;
  public resources: Resources;
  public renderer: Renderer;
  public world: World;

  constructor() {
    if (instance) return instance;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;

    this.canvas =
      (document.getElementById("experience-canvas") as HTMLCanvasElement) ??
      document.createElement("canvas");

    this.debug = new Debug();
    this.stats = new Stats();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resources = new Resources(sources);
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  resize(): void {
    this.camera.resize();
    this.renderer.resize();
    // this.world.resize();
  }

  update(): void {
    // if (this.stats.active) this.stats.instance?.begin();

    this.camera.update();
    this.renderer.update();

    // if (this.stats.active) this.stats.instance?.end();
  }
}
