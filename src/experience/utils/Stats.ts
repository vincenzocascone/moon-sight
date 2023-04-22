import stats from "stats.js";

export default class Stats {
  readonly active: boolean;
  public instance?: stats;

  constructor() {
    this.active = window.location.hash === "#dev";

    if (this.active) {
      this.instance = new stats();
      this.instance.showPanel(0);
      document.body.appendChild(this.instance.dom);
    }
  }
}
