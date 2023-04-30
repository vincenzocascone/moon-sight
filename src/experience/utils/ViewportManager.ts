import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

export default class ViewportManager extends EventEmitter {
  private readonly _fullscreenButtonElement: HTMLElement | null = null;
  size: Vector2;
  pixelRatio: number;
  isVisible: boolean;
  isMobile: boolean;

  constructor(fullscreenButtonElementId?: string) {
    super();

    if (fullscreenButtonElementId) {
      this._fullscreenButtonElement = document.getElementById(
        fullscreenButtonElementId
      );
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

    this._fullscreenButtonElement?.addEventListener("click", () =>
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
    if (this._fullscreenButtonElement) {
      const fullscreenElement =
        document.fullscreenElement || (document as any).webkitFullscreenElement;

      if (!fullscreenElement) {
        this._fullscreenButtonElement.innerHTML = "fullscreen";
      } else {
        this._fullscreenButtonElement.innerHTML = "fullscreen_exit";
      }
    }
  }
}
