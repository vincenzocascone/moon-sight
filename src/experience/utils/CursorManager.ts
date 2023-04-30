import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

export default class CursorManager extends EventEmitter {
  position: Vector2;

  constructor() {
    super();

    this.position = new Vector2();

    this.registerListener();
  }

  private registerListener() {
    window.addEventListener("mousemove", (event) => {
      this.position.x = event.clientX / window.innerWidth - 0.5;
      this.position.y = event.clientY / window.innerHeight - 0.5;
    });
  }
}
