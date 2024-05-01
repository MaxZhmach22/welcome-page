import {PerspectiveCamera, WebGLRenderer} from "three";
import {EngineService} from "./EngineService";

export class AppResizer {

  constructor(htmlContainer: Element,
              camera: PerspectiveCamera,
              renderer: WebGLRenderer,
              private readonly _engineService: EngineService) {
    this.updateSize(htmlContainer, camera, renderer);
    window.addEventListener('resize', () => this.updateSize(htmlContainer,camera, renderer));
    window.addEventListener('orientationchange', () => {
      this.updateSize(htmlContainer, camera, renderer)
    });
  }

  updateSize(htmlContainer: Element, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    camera.aspect = htmlContainer.clientWidth / htmlContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(htmlContainer.clientWidth, htmlContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    this._engineService.appSize$.next({width: htmlContainer.clientWidth, height: htmlContainer.clientHeight})
  }
}
