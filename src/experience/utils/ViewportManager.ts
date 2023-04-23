import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

export default class ViewportManager extends EventEmitter {
  viewport: {
    size: Vector2;
    pixelRatio: number;
    orientation: Vector2;
  };
  cursor: { position: Vector2 };

  constructor() {
    super();

    this.viewport = {
      size: new Vector2(window.innerWidth, window.innerHeight),
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      orientation: new Vector2(),
    };

    this.cursor = {
      position: new Vector2(),
    };

    this.setListeners();
  }

  private setListeners() {
    window.addEventListener("resize", () => {
      this.viewport.size.width = window.innerWidth;
      this.viewport.size.height = window.innerHeight;
      this.viewport.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    window.addEventListener("mousemove", (event) => {
      this.cursor.position.x = event.clientX / this.viewport.size.width - 0.5;
      this.cursor.position.y = event.clientY / this.viewport.size.height - 0.5;
    });

    window.addEventListener("deviceorientation", (event) => {
      this.viewport.orientation.x = ((event.gamma ?? 0) + 90) / 180 - 0.5;
      this.viewport.orientation.y = -(((event.beta ?? 0) + 180) / 360 - 0.5);
    });

    document
      ?.querySelector(".fullscreen-button")
      ?.addEventListener("click", () => {
        this.toggleFullscreen();
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
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen_exit";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().finally();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen";
    }
  }
}
