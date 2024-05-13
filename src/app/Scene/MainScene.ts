import {
  AmbientLight,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  SRGBColorSpace, Vector2,
  Vector3, WebGLRenderTarget
} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {ResourcesGLTF, ResourcesTextures} from "../Loading/ResourcesMap";
import {GLTFModels} from "../Enums/Models";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Images} from "../Enums/Images";
import {ElementRef, QueryList} from "@angular/core";
import {HintsViewInitializer} from "./HintsViewInitializer";
import {Layers} from "../Enums/Layers";
import {OrbitControlsInitializer} from "./OrbitControlsInitializer";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {BokehPass} from "three/examples/jsm/postprocessing/BokehPass";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";
import {SSAARenderPass} from "three/examples/jsm/postprocessing/SSAARenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {InfoPoints} from "../Configurations/InfoPoints";
import {gsap} from "gsap";
import {LoadingViewBuilder} from "../Loading/LoadingViewBuilder";
import {environment} from "../../environments/environment";
import {PostProcessingInitializer} from "./PostProcessingInitializer";


export class MainScene extends Group {

  private _hintViewInitializer: HintsViewInitializer | null = null;
  private _cameraMovementSystem: OrbitControlsInitializer | null = null;
  private readonly _postProcessingInitializer = new PostProcessingInitializer(this._threeJS, this._camera, this._panelGuiService);


  get EffectComposer() {
    return this._postProcessingInitializer.effectComposer;
  }

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _transformControls: TransformControlService,
              private readonly _camera: PerspectiveCamera,
              private readonly _panelGuiService: GuiInfoPanelService,
              private readonly pointsRef: QueryList<ElementRef>,
              private readonly lablesRef: QueryList<ElementRef>) {
    super();
    this.init();
  }

  private init() {

    const room = ResourcesGLTF.get(GLTFModels.Room)!;

    this.setPointsOfCameraView(room)
    this.setRoomMaterials(room);
    this._threeJS.scene.background = new Color(0x000000);

    room.scene.scale.set(1, 1, 1);

    this._hintViewInitializer = new HintsViewInitializer(
      this._threeJS,
      this._transformControls,
      this._camera,
      room.scene,
      this.pointsRef,
      this.lablesRef);

    this._hintViewInitializer.init(this);

    this._cameraMovementSystem = new OrbitControlsInitializer(this._camera, this._transformControls)

    this._postProcessingInitializer.init();

    this.addDuneButton(room);

    this._threeJS.scene.add(room.scene);
  }

  private setRoomMaterials(room: GLTF) {
    room.scene.traverse((child) => {
      if (child instanceof Mesh) {
        if (child.name === 'BaseRoom') {
          const wallsTexture = ResourcesTextures.get(Images.BaseRoom)!;
          wallsTexture.flipY = false;
          wallsTexture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: wallsTexture})
        } else if (child.name === 'Decor_01') {
          const decor = ResourcesTextures.get(Images.Decor_01)!;
          decor.flipY = false;
          decor.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: decor})
        } else if (child.name === 'Decor_02') {
          const decor = ResourcesTextures.get(Images.Decor_02)!;
          decor.flipY = false;
          decor.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: decor})
        } else if (child.name === 'Decor_03') {
          const decor = ResourcesTextures.get(Images.Decor_03)!;
          decor.flipY = false;
          decor.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: decor})
        } else if (child.name === 'Funuture_01') {
          const funuture = ResourcesTextures.get(Images.Funuture_01)!;
          funuture.flipY = false;
          funuture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: funuture})
        }
        else if(child.name === "ScreenPlane"){
          child.layers.enable(Layers.ScreenPanel);
          child.material = new MeshBasicMaterial({color: 0x000000, opacity: 0.01, transparent: true, side: 2})
        }
      }
    })
  }

  update(dt: number) {
    if(this._hintViewInitializer) this._hintViewInitializer.update(dt);
    if(this._cameraMovementSystem) this._cameraMovementSystem.update(dt);
  }

  private setPointsOfCameraView(room: GLTF) {
    room.scene.traverse((child) => {
      InfoPoints.forEach((value, key) => {
        if(child.name === value.attachedMeshName){
          let cameraPosition: Vector3 = child.children[0].getWorldPosition(new Vector3());
          value.position = {
            pointOfView: child.position.clone(),
            cameraPosition: new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z)
          };
        }
      })
    })
  }

  private addDuneButton(room: GLTF) {

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    document.addEventListener('pointerdown', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this._camera);
      raycaster.layers.set(Layers.ScreenPanel);
      const intersects = raycaster.intersectObjects(room.scene.children, true);
      if(intersects.length > 0){
        this.moveCameraToPoint(intersects[0].object.position);
      }
    });
  }

  private moveCameraToPoint(point: Vector3) {
    const tween = gsap.to(this._camera.position, {
      duration: 1,
      x: point.x,
      y: point.y,
      z: point.z,
      onStart: () => {
        this._transformControls.orbitControls.enabled = false;
        this._transformControls.orbitControls.target.copy(point);
        this._postProcessingInitializer.bokehPass.enabled = true;
      },
      onUpdate: () => {
       this._postProcessingInitializer.unrealBloomEffect.strength = tween.progress() * 3
       this._postProcessingInitializer.unrealBloomEffect.threshold = 1 - tween.progress()
       this._postProcessingInitializer.unrealBloomEffect.radius = tween.progress() * 3;
      },
      onComplete: () => {
        this._transformControls.orbitControls.enabled = true
        window.location.href = environment.duneLink
      }
    });
  }
}
