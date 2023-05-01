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
  private _config: StatsPanelConfig;
  readonly active: boolean;
  instance?: StatsJS;

  constructor(
    config: StatsPanelConfig = { panelType: PanelType.FPS, devHash: "#dev" }
  ) {
    this._config = config;

    this.active = window.location.hash === this._config.devHash;

    if (this.active) {
      this.instance = new StatsJS();
      this.instance.showPanel(this._config.panelType || PanelType.FPS);
      document.body.appendChild(this.instance.dom);
    }
  }
}
