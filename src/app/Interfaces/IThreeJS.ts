import {Scene, WebGLRenderer} from "three";

export interface IThreeJS{
  renderer: WebGLRenderer;
  scene: Scene;
  canvas: HTMLCanvasElement;
}
