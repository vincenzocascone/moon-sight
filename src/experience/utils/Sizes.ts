import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
  public width: number;
  public height: number;
  public pixelRatio: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });

    document
      ?.querySelector(".fullscreen-button")
      ?.addEventListener("click", () => {
        this.toggleFullscreen();
      });
  }

  toggleFullscreen(): void {
    const fullscreenElement =
      // @ts-ignore
      document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
        // @ts-ignore
      } else if (document.body.webkitRequestFullscreen) {
        // @ts-ignore
        document.body.webkitRequestFullscreen();
      }
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen_exit";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        // @ts-ignore
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore
        document.webkitExitFullscreen();
      }
      (document.getElementById("fullscreen-button") as HTMLElement).innerHTML =
        "fullscreen";
    }
  }
}
