import Hammer from "hammerjs";
import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

interface ViewportManagerConfig {
  fullscreenSupport?: boolean;
}

export default class ViewportManager extends EventEmitter {
  public size: Vector2;
  public pixelRatio: number;
  public isVisible: boolean;
  public isMobile: boolean;
  private config: ViewportManagerConfig;

  public constructor(
    config: ViewportManagerConfig = { fullscreenSupport: false }
  ) {
    super();

    this.config = config;

    this.size = new Vector2(window.innerWidth, window.innerHeight);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.isVisible = true;
    this.isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    this.registerListeners();
  }

  private registerListeners() {
    window.addEventListener("resize", () => {
      this.size.width = window.innerWidth;
      this.size.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    document.addEventListener("visibilitychange", () => {
      this.isVisible = !document.hidden;
    });

    if (this.config.fullscreenSupport) {
      window.addEventListener("keyup", (event) => {
        if (event.key === "f") {
          this.toggleFullscreen();
        }
      });
    }

    if (this.isMobile) {
      const hammertime = new Hammer(document.body);
      hammertime.on("tap", (event: any) => {
        if (event.tapCount == 2) this.toggleFullscreen();
      });
    }
  }

  private toggleFullscreen(): void {
    const fullscreenElement =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    if (!fullscreenElement) {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen().finally();
      } else if ((document as any).body.webkitRequestFullscreen) {
        (document as any).body.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().finally();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  }
}
