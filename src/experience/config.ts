import { PanelType } from "./utils/StatsPanel";

export default {
  experience: {
    canvasId: "main-canvas",
    camera: {
      parallaxFactor: 0.003,
    },
    utils: {
      viewportManager: {
        fullscreenButtonId: "fullscreen-button",
      },
      resourcesManager: {
        loaderId: "loading-bar",
      },
      debugUi: {
        width: 300,
        hash: "#dev",
      },
      statsPanel: {
        hash: "#dev",
        panelType: PanelType.FPS,
      },
    },
  },
};
