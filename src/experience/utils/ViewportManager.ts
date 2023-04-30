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
    //     this.viewport.orientation.x = (gamma + Math.PI / 2) / Math.PI - 0.5;
    //     this.viewport.orientation.y = -(beta + Math.PI) / (2 * Math.PI) - 0.5;
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
}
