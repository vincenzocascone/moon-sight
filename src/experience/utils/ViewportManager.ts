import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

export default class ViewportManager extends EventEmitter {
  size: Vector2;
  pixelRatio: number;
  orientation: Vector2;
  isVisible: boolean;

  constructor() {
    super();

    this.size = new Vector2(window.innerWidth, window.innerHeight);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.orientation = new Vector2();
    this.isVisible = true;

    this.registerListeners();
  }

  private registerListeners() {
    window.addEventListener("resize", () => {
      this.size.width = window.innerWidth;
      this.size.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    // if ("RelativeOrientationSensor" in window) {
    //   //@ts-ignore
    //   const sensor = new AbsoluteOrientationSensor({ frequency: 60 });
    //
    //   sensor.addEventListener("reading", () => {
    //     // Convert the quaternion to Euler angles (alpha, beta, gamma)
    //     const [q0, q1, q2, q3] = sensor.quaternion;
    //     const sinHalfBeta = q1 * q3 - q0 * q2;
    //     let beta, gamma;
    //
    //     if (sinHalfBeta <= -0.499999) {
    //       beta = 2 * Math.atan2(q1, q0);
    //       gamma = -Math.PI / 2;
    //     } else if (sinHalfBeta >= 0.499999) {
    //       beta = 2 * Math.atan2(q1, q0);
    //       gamma = Math.PI / 2;
    //     } else {
    //       beta = Math.atan2(
    //         2 * (q0 * q1 + q2 * q3),
    //         1 - 2 * (q1 * q1 + q2 * q2)
    //       );
    //       gamma = Math.asin(2 * sinHalfBeta);
    //     }
    //
    //     // Update the orientation values
    //     this.orientation.x = (gamma + Math.PI / 2) / Math.PI - 0.5;
    //     this.orientation.y = -(beta + Math.PI) / (2 * Math.PI) - 0.5;
    //   });
    //
    //   sensor.addEventListener("error", (event: any) => {
    //     console.error("Error: " + event.error.name, event.error.message);
    //   });
    //
    //   sensor.start();
    // }

    document
      ?.getElementById("fullscreen-button")
      ?.addEventListener("click", () => {
        this.toggleFullscreen();
      });

    document.addEventListener("fullscreenchange", () => {
      this.updateFullscreenButton();
    });

    if (typeof document.hidden !== "undefined") {
      // Add the event listener for visibility change
      document.addEventListener(
        "visibilitychange",
        this.handleVisibilityChange
      );
    } else {
      console.warn("The browser does not support the Page Visibility API.");
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

    this.updateFullscreenButton();
  }

  private updateFullscreenButton(): void {
    const fullscreenElement =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    if (!fullscreenElement) {
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen";
    } else {
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen_exit";
    }
  }

  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  };
}
