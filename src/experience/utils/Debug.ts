import GUI from "lil-gui";

export default class Debug {
  readonly active: boolean;
  public ui?: GUI;

  constructor() {
    this.active = window.location.hash === "#dev";

    if (this.active) {
      this.ui = new GUI({ width: 400 });
    }
  }
}
