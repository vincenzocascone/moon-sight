import { Vector2 } from "three";

import EventEmitter from "./EventEmitter";

export default class CursorManager extends EventEmitter {
  position: Vector2;

  constructor() {
    super();

    this.position = new Vector2();

    this.registerListeners();
  }

  private registerListeners() {
    window.addEventListener("mousemove", (event) => {
      this.position.x = event.clientX / window.innerWidth - 0.5;
      this.position.y = event.clientY / window.innerHeight - 0.5;
    });
  }
}
// allowUnreachableCode, allowUnusedLabels, alwaysStrict, exactOptionalPropertyTypes, noFallthroughCasesInSwitch, noImplicitAny, noImplicitOverride, noImplicitReturns, noImplicitThis, noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess, noUnusedLocals, noUnusedParameters, strict, strictBindCallApply, strictFunctionTypes, strictNullChecks, strictPropertyInitialization and useUnknownInCatchVariables
