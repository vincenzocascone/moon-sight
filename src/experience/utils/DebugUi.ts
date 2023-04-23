import GUI from "lil-gui";

interface DebugOptions {
  width?: number;
  devHash?: string;
}

export default class DebugUi {
  readonly active: boolean;
  ui?: GUI;

  constructor(options: DebugOptions = {}) {
    const { width = 400, devHash = "#dev" } = options;
    this.active = window.location.hash === devHash;

    if (this.active) {
      this.ui = new GUI({ width });
    }
  }

  destroy(): void {
    if (this.ui) {
      this.ui.destroy();
    }
  }
}
