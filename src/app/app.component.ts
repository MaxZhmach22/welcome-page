import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ReinhardToneMapping, Scene, SRGBColorSpace, TextureLoader, WebGLRenderer} from "three";
import {IThreeJS} from "./Interfaces/IThreeJS";
import {EngineService} from "./Services/EngineService";
import {ResourcesGLTF, ResourcesTextures} from "./Loading/ResourcesMap";
import {GLTFModels} from "./Enums/Models";
import {Images} from "./Enums/Images";
import {InfoPoints} from "./Configurations/InfoPoints";
import {
  TransformControlService
} from "./Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {gsap} from "gsap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

  @ViewChild('gameContainer') private gameContainer!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingProgressElement') private loadingProgressElement!: ElementRef;

  @ViewChildren('point') public pointsRef!: QueryList<ElementRef>;
  @ViewChildren('pointLable') public lablesRef!: QueryList<ElementRef>;
  public points = Array(4).fill(null).map((_, index) => index + 1);

  loadingProgress: string = '';
  currentPoint: number = 0;
  isLoad: boolean = false;

  constructor(private readonly _engineService: EngineService,
              private readonly _transformControls: TransformControlService){
  }

  async ngAfterViewInit(){

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      canvas: this.canvas.nativeElement,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ReinhardToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = SRGBColorSpace;

    const threeJS: IThreeJS = {
      renderer: renderer,
      scene: new Scene(),
      canvas: this.gameContainer.nativeElement
    }

    this._engineService.onLoadProgress$.subscribe((progress: number) => {
      this.loadingProgress = (progress * 100).toString().split('.')[0] + '%';
      if(progress === 1){
        this.loadingProgressElement.nativeElement.style.visibility = "hidden";
        this.isLoad = true;
        this.lablesRef.forEach(value => value.nativeElement.style.visibility = "visible");
      }
    })

    //Await for resources to load
    for(const resource of Object.keys(GLTFModels)){
      const model = await this._engineService.resourcesLoader.loadGLTFModel(GLTFModels[resource as keyof typeof GLTFModels]);
      ResourcesGLTF.set(GLTFModels[resource as keyof typeof GLTFModels], model);
    }

    const textureLoader = new TextureLoader(this._engineService.resourcesLoader.loaderManager)

    for (const resource of Object.keys(Images)) {
      const image = await textureLoader.load(Images[resource as keyof typeof Images]);
      ResourcesTextures.set(Images[resource as keyof typeof Images], image);
    }

    await this._engineService.init(threeJS, this.gameContainer, this.pointsRef, this.lablesRef);
  }

  choosePointClick(i: number) {
    this.currentPoint = i;
    this.resetPoints();
    this._transformControls.orbitControls.target.copy(InfoPoints.get(i)!.position!.pointOfView);
    gsap.to(this._engineService.camera.position, {
      duration: 1.5,
      x: InfoPoints.get(i)!.position!.cameraPosition.x,
      y: InfoPoints.get(i)!.position!.cameraPosition.y,
      z: InfoPoints.get(i)!.position!.cameraPosition.z,
      onStart: () => {
        this.lablesRef.toArray()[i-1].nativeElement.classList.add('active')
        this.lablesRef.toArray()[i-1].nativeElement.innerHTML = InfoPoints.get(i)?.hintMessage;
        this._transformControls.orbitControls.enabled = false;
      },
      onComplete: () => {
        this._transformControls.orbitControls.enabled = true}
    });
  }

  private resetPoints() {
    this.lablesRef.forEach((lable, index) => {
      lable.nativeElement.innerHTML = index + 1;
      lable.nativeElement.classList.remove('active')
    })
  }

  freeMovement() {
    this.resetPoints();
    if(this.currentPoint === 5) return;
    this.currentPoint = 5;
    this._transformControls.orbitControls.target.copy(InfoPoints.get(5)!.position!.pointOfView);
    gsap.to(this._engineService.camera.position, {
      duration: 1,
      x: InfoPoints.get(5)!.position!.cameraPosition.x,
      y: InfoPoints.get(5)!.position!.cameraPosition.y,
      z: InfoPoints.get(5)!.position!.cameraPosition.z,
      onStart: () => {
        this._transformControls.orbitControls.enabled = false;
      },
      onComplete: () => {
        this._transformControls.orbitControls.enabled = true}
    });
  }
}
