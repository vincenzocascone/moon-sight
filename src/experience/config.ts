import sources from "./sources";
import { PanelType } from "./utils/StatsPanel";

export default {
  canvasElementId: "main-canvas",
  camera: {
    parallaxFactor: 0.003,
  },
  utils: {
    viewportManager: {
      fullscreenButtonElementId: "fullscreen-button",
    },
    resourcesManager: {
      loaderElementId: "loading-bar",
      sources,
    },
    debugUi: {
      width: 300,
      devHash: "#dev",
    },
    statsPanel: {
      devHash: "#dev",
      panelType: PanelType.FPS,
    },
  },
};
