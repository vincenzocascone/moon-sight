import StatsJS from "stats.js";

export enum PanelType {
  FPS = 0,
  MS = 1,
}
interface StatsOptions {
  panelType?: PanelType;
  devHash?: string;
}

export default class StatsPanel {
  readonly active: boolean;

  instance?: StatsJS;

  constructor(options: StatsOptions = {}) {
    const { panelType = PanelType.FPS, devHash = "#dev" } = options;
    this.active = window.location.hash === devHash;

    if (this.active) {
      this.instance = new StatsJS();
      this.instance.showPanel(panelType);
      document.body.appendChild(this.instance.dom);
    }
  }
}
