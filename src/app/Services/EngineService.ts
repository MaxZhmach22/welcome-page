import {ElementRef, Injectable, QueryList} from "@angular/core";
import {Clock, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";

import {update as updateMeshUI} from "three-mesh-ui";
import {AppResizer} from "./AppResizer";
import {ReplaySubject, Subject} from "rxjs";
import {ResourcesLoader} from "../Loading/ResourcesLoader";
import {LoadingViewBuilder} from "../Loading/LoadingViewBuilder";
import {MouseRaycatsService} from "../Helpers/three-js-helpers-mouse-raycast/mouse-raycast/mouse-raycats.service";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import {AudioService} from "./AudioService";
import {environment} from "../../environments/environment";
import {ResourcesGLTF} from "../Loading/ResourcesMap";
import {GLTFModels} from "../Enums/Models";
import {MainScene} from "../Scene/MainScene";

@Injectable({providedIn: 'root'})
export class EngineService {


  private readonly _camera: PerspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
  private readonly _onLoadComplete: ReplaySubject<void> = new ReplaySubject<void>();
  private readonly _onLoadProgress: Subject<number> = new Subject<number>();
  private readonly _onUpdate: Subject<number> = new Subject<number>();
  private readonly _appSize: ReplaySubject<{ width: number, height: number }> = new ReplaySubject<{
    width: number,
    height: number
  }>();
  private readonly _clock = new Clock();
  private readonly _resourcesLoader = new ResourcesLoader()

  private _threeJS: IThreeJS | null = null;
  private _previousElapsedTime = 0;

  //If started with home page
  private _homePageViewed = false;
  private _mainScene: MainScene | null = null;

  get homePageViewed(): boolean {
    return this._homePageViewed;
  }

  set homePageViewed(value: boolean) {
    this._homePageViewed = value;
  }

  get onLoadComplete$(): ReplaySubject<void> {
    return this._onLoadComplete;
  }

  get onLoadProgress$(): Subject<number> {
    return this._onLoadProgress;
  }

  get onUpdate$(): Subject<number> {
    return this._onUpdate;
  }

  get appSize$(): ReplaySubject<{ width: number, height: number }> {
    return this._appSize;
  }

  get threeJS(): IThreeJS {
    if (!this._threeJS) throw new Error("ThreeJS is not initialized");
    return this._threeJS;
  }

  get camera(): PerspectiveCamera {
    return this._camera;
  }

  get resourcesLoader(): ResourcesLoader {
    return this._resourcesLoader;
  }

  constructor(private readonly mouseRaycastService: MouseRaycatsService,
              private readonly transformControls: TransformControlService,
              private readonly panelGuiService: GuiInfoPanelService,
              private readonly _audioService: AudioService) {
    this.render = this.render.bind(this);
    if (environment.production) {
      this.panelGuiService.gui.hide()
    }
    this.panelGuiService.gui.close()
  }

  async init(threeJS: IThreeJS, gameContainer: ElementRef,  pointsRef: QueryList<ElementRef>,lablesRef: QueryList<ElementRef>) {

    this._threeJS = threeJS;

    new AppResizer(gameContainer.nativeElement, this._camera, this._threeJS.renderer, this);
    this.helpersInit(this._threeJS.scene, this._camera, this._threeJS.renderer);

    //Init loading overlay
    const loadingScreen = new LoadingViewBuilder(this, this.panelGuiService);
    loadingScreen.constructView(threeJS)

    this._mainScene = new MainScene(this._threeJS, this.transformControls, this._camera, pointsRef, lablesRef);
    this._threeJS.scene.add(this._mainScene);

    this._threeJS.renderer.setAnimationLoop(this.render);
  }

  private helpersInit(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.mouseRaycastService.init(camera);
    this.transformControls.init(scene, camera, renderer);
  }

  private render(dt: number, frame: XRFrame) {

    if (!this._threeJS) {
      console.error("No threeJS instance");
      return;
    }

    if (!this._camera) {
      console.error("No camera instance");
      return;
    }

    //Delta time
    const elapsedTime = this._clock.getElapsedTime();
    const deltaTime = elapsedTime - this._previousElapsedTime;
    this._previousElapsedTime = elapsedTime;

    this._onUpdate.next(deltaTime);
    if(this._mainScene) this._mainScene.update(deltaTime);
    updateMeshUI()
    //Helpers
    this.mouseRaycastService.update(deltaTime);
    //this.transformControls.update()

    this._threeJS.renderer.render(this._threeJS.scene, this._camera);
  }
}
