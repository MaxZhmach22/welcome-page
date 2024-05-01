import {Injectable} from "@angular/core";
import {Vector2, WebGLRenderTarget} from "three";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {BokehPass} from "three/examples/jsm/postprocessing/BokehPass";
import {OutputPass} from "three/examples/jsm/postprocessing/OutputPass";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {gsap} from "gsap";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";

@Injectable({providedIn: 'root'})
export class PostProcessingController{

  private _threeJS: IThreeJS | null = null;
  private _camera: any;
  private _effectComposer!: EffectComposer;
  private _initialized = false;
  private _enabled = false;

  private _bokehPass!: BokehPass;

  private _bloomParams = {
    threshold: 0.312,
    strength: 0.198,
    radius: 0.603,
  }

  private _bokehParams = {
    focus: 0.824,
    aperture: 0.025,
    maxblur: 0.012
  }

  private _resetTween: GSAPTween | null = null;

  get effectComposer(): EffectComposer {
    return this._effectComposer;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  constructor(private readonly panelGuiService: GuiInfoPanelService) {
  }

  init(threeJS: IThreeJS, camera: any){

    this._threeJS = threeJS;
    this._camera = camera;

    const renderTarget = new WebGLRenderTarget(800, 600, {
      samples: 2
    });

    const effectComposer = new EffectComposer(this._threeJS.renderer, renderTarget);
    effectComposer.setPixelRatio( Math.min(window.devicePixelRatio,2));
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const bloomParams = {
      threshold: 0.312,
      strength: 0.198,
      radius: 0.603,
    };

    const renderScene = new RenderPass( this._threeJS.scene, this._camera );
    const renderPass = new UnrealBloomPass(new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    renderPass.threshold = bloomParams.threshold;
    renderPass.strength = bloomParams.strength;
    renderPass.radius = bloomParams.radius;

    const postProcessingFolder = this.panelGuiService.gui.addFolder("PostProcessing")

    postProcessingFolder.close()

    postProcessingFolder.add(bloomParams, 'threshold').min(0).max(1).step(0.001).onChange(() => {
      renderPass.threshold = bloomParams.threshold;
    })
    postProcessingFolder.add(bloomParams, 'strength').min(0).max(3).step(0.001).onChange(() => {
      renderPass.strength = bloomParams.strength;
    })
    postProcessingFolder.add(bloomParams, 'radius').min(0).max(3).step(0.001).onChange(() => {
      renderPass.radius = bloomParams.radius;
    })

    this._bokehPass = new BokehPass( this._threeJS.scene, this._camera, {
      focus: this._bokehParams.focus,
      aperture: this._bokehParams.aperture,
      maxblur: this._bokehParams.maxblur,
    });

    postProcessingFolder.add(this._bokehParams, 'focus').min(0).max(3).step(0.001).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms[ "focus" ].value = this._bokehParams.focus;
    }).listen()
    postProcessingFolder.add(this._bokehParams, 'aperture').min(0).max(0.2).step(0.001).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms[ "aperture" ].value = this._bokehParams.aperture;
    }).listen()
    postProcessingFolder.add(this._bokehParams, 'maxblur').min(0).max(0.1).step(0.001).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms[ "maxblur" ].value = this._bokehParams.maxblur;
    }).listen()

    const outputPass = new OutputPass();
    effectComposer.addPass(renderScene);
    effectComposer.addPass(renderPass);
    effectComposer.addPass(this._bokehPass);
    effectComposer.addPass(outputPass);
    this._effectComposer = effectComposer;
    this._initialized = true;
  }


  resetBokehEffect() {

    if(this._resetTween){
      this._resetTween.kill()
    }

    const resetValues = {
      focus: this._bokehParams.focus,
      aperture: this._bokehParams.aperture,
      maxblur: this._bokehParams.maxblur,
    }

    this._resetTween = gsap.to(resetValues, {
      focus: 0,
      aperture: 0,
      maxblur: 0,
      duration: 2,
      onUpdate: () => {
        // @ts-ignore
        this._bokehPass.uniforms[ "focus" ].value = resetValues.focus;
        // @ts-ignore
        this._bokehPass.uniforms[ "aperture" ].value = resetValues.aperture;
        // @ts-ignore
        this._bokehPass.uniforms[ "maxblur" ].value = resetValues.maxblur;
      },
      onComplete: () => {
        // @ts-ignore
        this._bokehPass.uniforms[ "focus" ].value = 0;
        // @ts-ignore
        this._bokehPass.uniforms[ "aperture" ].value = 0;
        // @ts-ignore
        this._bokehPass.uniforms[ "maxblur" ].value = 0;
      }
    })
  }

  addBokehEffect(){

    if(this._resetTween){
      this._resetTween.kill()
    }

    const resetValues = {
      focus: 0,
      aperture: 0,
      maxblur: 0,
    }

    this._resetTween = gsap.to(resetValues, {
      focus: this._bokehParams.focus,
      aperture: this._bokehParams.aperture,
      maxblur: this._bokehParams.maxblur,
      duration: 0.5,
      onUpdate: () => {
        // @ts-ignore
        this._bokehPass.uniforms[ "focus" ].value = resetValues.focus;
        // @ts-ignore
        this._bokehPass.uniforms[ "aperture" ].value = resetValues.aperture;
        // @ts-ignore
        this._bokehPass.uniforms[ "maxblur" ].value = resetValues.maxblur;
      },
      onComplete: () => {
        // @ts-ignore
        this._bokehPass.uniforms[ "focus" ].value = this._bokehParams.focus;
        // @ts-ignore
        this._bokehPass.uniforms[ "aperture" ].value = this._bokehParams.aperture;
        // @ts-ignore
        this._bokehPass.uniforms[ "maxblur" ].value = this._bokehParams.maxblur;
      }
    })
  }
}
