import {
  EdgeDetectionMode,
  EffectComposer,
  EffectPass,
  PredicationMode,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
} from "postprocessing";
import * as THREE from "three";

import Experience from "./Experience";

export default class Renderer {
  public instance: THREE.WebGL1Renderer;
  private composer!: EffectComposer;

  public constructor() {
    const { canvas } = Experience.getInstance();

    this.instance = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });

    this.setPostProcessing();
    this.resize();
  }

  public resize(): void {
    const { viewportManager } = Experience.getInstance();

    this.instance.setSize(
      viewportManager.size.width,
      viewportManager.size.height
    );

    this.instance.setPixelRatio(viewportManager.pixelRatio);

    this.composer.setSize(
      viewportManager.size.width,
      viewportManager.size.height
    );
  }

  public update(): void {
    this.composer.render();
  }

  private setPostProcessing(): void {
    this.composer = new EffectComposer(this.instance);

    const renderPass = new RenderPass(
      Experience.getInstance().scene,
      Experience.getInstance().camera.instance
    );

    this.composer.addPass(renderPass);

    const antialiasingEffect = new SMAAEffect({
      preset: SMAAPreset.ULTRA,
      edgeDetectionMode: EdgeDetectionMode.COLOR,
      predicationMode: PredicationMode.DEPTH,
    });

    const effectPass = new EffectPass(
      Experience.getInstance().camera.instance,
      antialiasingEffect
    );

    effectPass.renderToScreen = true;

    this.composer.addPass(effectPass);
  }
}
