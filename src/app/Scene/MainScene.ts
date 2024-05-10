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
import {HintsView} from "./HintsView";
import {Layers} from "../Enums/Layers";
import {CameraMovementSystem} from "./CameraMovementSystem";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {BokehPass} from "three/examples/jsm/postprocessing/BokehPass";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";
import {SSAARenderPass} from "three/examples/jsm/postprocessing/SSAARenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";


export class MainScene extends Group {

  private _hintView: HintsView | null = null;
  private _cameraMovementSystem: CameraMovementSystem | null = null;

  private _renderTarget = new WebGLRenderTarget(800, 600, {
    colorSpace: SRGBColorSpace,
    samples: this._threeJS.renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  private _effectComposer = new EffectComposer(this._threeJS.renderer, this._renderTarget);

  private _bokehParams= {
    enable: false,
    focus: 0.312,
    aperture: 0.198,
    maxblur: 0.004,
    exposure: 1
  };

  private _bokehPass = new BokehPass( this._threeJS.scene, this._camera, {
    focus: this._bokehParams.focus,
    aperture: this._bokehParams.aperture,
    maxblur: this._bokehParams.maxblur,
  });

  private _unrealBloomEffect = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 0.24, 0.234, 0.12);


  get EffectComposer() {
    return this._effectComposer;
  }

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _transformControls: TransformControlService,
              private readonly _camera: PerspectiveCamera,
              private readonly _panelGuiService: GuiInfoPanelService,
              private readonly pointsRef: QueryList<ElementRef>,
              private readonly lablesRef: QueryList<ElementRef>) {
    super();
    const postProcessingFolder = this._panelGuiService.gui.addFolder("PostProcessing")

    postProcessingFolder.add(this._bokehParams, 'focus').min(0).max(3000).step(1).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms['focus'].value = this._bokehParams.focus;
    })
    postProcessingFolder.add(this._bokehParams, 'aperture').min(0).max(10).step(0.01).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms['aperture'].value = this._bokehParams.aperture;
    })
    postProcessingFolder.add(this._bokehParams, 'maxblur').min(0).max(0.01).step(0.0001).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms['maxblur'].value = this._bokehParams.maxblur;
    })
    postProcessingFolder.add(this._bokehParams, 'enable').onChange(() => {
      this._bokehPass.enabled = this._bokehParams.enable;
    })

    postProcessingFolder.add(this._unrealBloomEffect, 'threshold').min(0).max(1).step(0.001);
    postProcessingFolder.add(this._unrealBloomEffect, 'strength').min(0).max(3).step(0.001);
    postProcessingFolder.add(this._unrealBloomEffect, 'radius').min(0).max(3).step(0.001);

    this._bokehPass.enabled = false

    this.init();
  }


  private _renderPass = new RenderPass(this._threeJS.scene, this._camera);

  private init() {

    const room = ResourcesGLTF.get(GLTFModels.Room)!;

    this.setRoomMaterials(room);

    console.log(room)
    room.scene.scale.set(1, 1, 1);

    this._hintView = new HintsView(
      this._threeJS,
      this._transformControls,
      this._camera,
      room.scene,
      this.pointsRef,
      this.lablesRef);

    this._hintView.init(this);

    this._cameraMovementSystem = new CameraMovementSystem(this._camera, this._transformControls)

    this._threeJS.scene.background = new Color(0x000000);


    const effectComposer = this._effectComposer;
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = this._renderPass;
    effectComposer.addPass(renderPass);

    effectComposer.addPass(this._bokehPass);
    effectComposer.addPass(this._unrealBloomEffect);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    effectComposer.addPass(gammaCorrectionPass);


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
        console.log(child.name)
      }
    })
  }


  update(dt: number) {
    if(this._hintView) this._hintView.update(dt);
    if(this._cameraMovementSystem) this._cameraMovementSystem.update(dt);
  }

}
