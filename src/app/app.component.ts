import {AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ReinhardToneMapping, Scene, SRGBColorSpace, TextureLoader, WebGLRenderer} from "three";
import {IThreeJS} from "./Interfaces/IThreeJS";
import {OrbitControlSettingsProvider} from "./Services/OrbitControlSettingsProvider";
import {EngineService} from "./Services/EngineService";
import {ResourcesGLTF, ResourcesTextures} from "./Loading/ResourcesMap";
import {GLTFModels} from "./Enums/Models";
import {Images} from "./Enums/Images";
import {InfoPoints} from "./Configurations/InfoPoints";

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

  public points = Array(5).fill(null).map((_, index) => index + 1);
  protected readonly PathConfig = InfoPoints;

  loadingProgress: string = '';

  constructor(private readonly _engineService: EngineService,
              private readonly _orbitControls: OrbitControlSettingsProvider){
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

  }


}
