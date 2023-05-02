import StatsJS from "stats.js";

export enum PanelType {
  FPS = 0,
  MS = 1,
}
interface StatsPanelConfig {
  panelType?: PanelType;
  devHash?: string;
}

export default class StatsPanel {
  public readonly active: boolean;
  public instance?: StatsJS;
  private config: StatsPanelConfig;

  public constructor(
    config: StatsPanelConfig = { panelType: PanelType.FPS, devHash: "#dev" }
  ) {
    this.config = config;

    this.active = window.location.hash === this.config.devHash;

    if (this.active) {
      this.instance = new StatsJS();
      this.instance.showPanel(this.config.panelType || PanelType.FPS);
      document.body.appendChild(this.instance.dom);
    }
  }
}
