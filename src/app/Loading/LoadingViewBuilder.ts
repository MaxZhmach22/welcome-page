import {IThreeJS} from "../Interfaces/IThreeJS";
import {Mesh, PlaneGeometry, ShaderMaterial, TextureLoader, Vector2} from "three";
import {EngineService} from "../Services/EngineService";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import {gsap} from "gsap";

export class LoadingViewBuilder{

  private readonly _uniforms = {
    uAlpha: {value: 1.0},
  }

  constructor(private readonly _engineService: EngineService,
              private readonly _panelGuiService: GuiInfoPanelService) {
  }

  constructView(threeJS: IThreeJS) {

    const loader = document.getElementById("loader");
    loader!.style.visibility = "visible";

    this._engineService.resourcesLoader.loaderManager.onLoad = () => {
      this._engineService.onLoadComplete$.next();
      const subscription = this._engineService.onUpdate$.subscribe((dt: number) => {
        this._uniforms.uAlpha.value -= 0.01;
        if(this._uniforms.uAlpha.value <= 0){
          subscription.unsubscribe()
        }
      })
      const loader = document.getElementById("loader");
      loader!.style.visibility = "hidden";
    }

    this._engineService.resourcesLoader.loaderManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this._engineService.onLoadProgress$.next((itemsLoaded / itemsTotal));
    }

    this._panelGuiService.gui.add(this._uniforms.uAlpha, 'value').min(0).max(1).step(0.01).name('Alpha').listen();

    const overlayGeometry = new PlaneGeometry(2,2,1,1);
    const overlayMaterial = new ShaderMaterial({
      uniforms: this._uniforms,
      transparent: true,
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uAlpha;
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
      `
    })

    const overlay = new Mesh(overlayGeometry, overlayMaterial);
    overlay.name = "LoadingOverlay";
    threeJS.scene.add(overlay);
  }

  setAlpha(value: number){
    this._uniforms.uAlpha.value = value;
  }

}
