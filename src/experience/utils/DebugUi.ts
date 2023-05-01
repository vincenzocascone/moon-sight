import GUI from "lil-gui";

interface DebugUiConfig {
  width?: number;
  devHash?: string;
}

export default class DebugUi {
  public readonly active: boolean;
  public ui!: GUI;
  private config: DebugUiConfig;

  constructor(config: DebugUiConfig = {}) {
    this.config = config;

    this.active = window.location.hash === this.config.devHash;

    if (this.active) {
      this.ui = new GUI({ width: this.config.width || 300 });
    }
  }
}
