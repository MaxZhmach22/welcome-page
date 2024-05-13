import {PerspectiveCamera, SRGBColorSpace, Vector2, WebGLRenderTarget} from "three";
import {BokehPass} from "three/examples/jsm/postprocessing/BokehPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";

export class PostProcessingInitializer{

  private _renderTarget = new WebGLRenderTarget(800, 600, {
    colorSpace: SRGBColorSpace,
    samples: this._threeJS.renderer.getPixelRatio() === 1 ? 2 : 0,
  });

  private _effectComposer = new EffectComposer(this._threeJS.renderer, this._renderTarget);
  private _renderPass = new RenderPass(this._threeJS.scene, this._camera);

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

  get unrealBloomEffect(): UnrealBloomPass {
    return this._unrealBloomEffect;
  }
  get bokehPass(): BokehPass {
    return this._bokehPass;
  }

  get effectComposer(): EffectComposer {
    return this._effectComposer;
  }

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _camera: PerspectiveCamera,
              private readonly _panelGuiService: GuiInfoPanelService) {

    const postProcessingFolder = this._panelGuiService.gui.addFolder("PostProcessing")

    postProcessingFolder.add(this._bokehParams, 'focus').min(0).max(3000).step(1).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms['focus'].value = this._bokehParams.focus;
    })
    postProcessingFolder.add(this._bokehParams, 'aperture').min(0).max(10).step(0.01).onChange(() => {
      // @ts-ignore
      this._bokehPass.uniforms['aperture'].value = this._bokehParams.aperture;
    })
    postProcessingFolder.add(this._bokehParams, 'maxblur').min(0).max(0.1).step(0.0001).onChange(() => {
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

  }

  public init(){
    const effectComposer = this._effectComposer;
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer.setSize(window.innerWidth, window.innerHeight);

    const renderPass = this._renderPass;
    effectComposer.addPass(renderPass);

    effectComposer.addPass(this._bokehPass);
    effectComposer.addPass(this._unrealBloomEffect);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    effectComposer.addPass(gammaCorrectionPass);
  }

}
