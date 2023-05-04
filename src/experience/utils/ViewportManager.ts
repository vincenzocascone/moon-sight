import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

interface ViewportManagerConfig {
  fullscreenButtonElementId?: string;
}

export default class ViewportManager extends EventEmitter {
  public size: Vector2;
  public pixelRatio: number;
  public isVisible: boolean;
  public isMobile: boolean;
  private readonly fullscreenButtonElement?: HTMLElement;
  private config: ViewportManagerConfig;

  public constructor(config: ViewportManagerConfig = {}) {
    super();

    this.config = config;

    if (this.config?.fullscreenButtonElementId) {
      this.fullscreenButtonElement = document.getElementById(
        this.config.fullscreenButtonElementId
      )!;
    }

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

    this.fullscreenButtonElement?.addEventListener("click", () =>
      this.toggleFullscreen()
    );

    document.addEventListener("fullscreenchange", () =>
      this.updateFullscreenButton()
    );

    document.addEventListener("visibilitychange", () => {
      this.isVisible = !document.hidden;
    });
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

  private updateFullscreenButton(): void {
    if (this.fullscreenButtonElement) {
      const fullscreenElement =
        document.fullscreenElement || (document as any).webkitFullscreenElement;

      if (!fullscreenElement) {
        this.fullscreenButtonElement.innerHTML = "fullscreen";
      } else {
        this.fullscreenButtonElement.innerHTML = "fullscreen_exit";
      }
    }
  }
}
