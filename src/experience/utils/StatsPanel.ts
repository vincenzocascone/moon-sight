import StatsJS from "stats.js";

interface StatsOptions {
  panelType?: number;
  devHash?: string;
}

export default class StatsPanel {
  readonly active: boolean;

  instance?: StatsJS;

  constructor(options: StatsOptions = {}) {
    const { panelType = 0, devHash = "#dev" } = options;
    this.active = window.location.hash === devHash;

    if (this.active) {
      this.instance = new StatsJS();
      this.instance.showPanel(panelType);
      document.body.appendChild(this.instance.dom);
    }
  }

  destroy(): void {
    if (this.instance) {
      document.body.removeChild(this.instance.dom);
      this.instance = undefined;
    }
  }
}
