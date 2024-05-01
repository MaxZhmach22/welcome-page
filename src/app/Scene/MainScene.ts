import {AmbientLight, Color, DirectionalLight, Group, PerspectiveCamera} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {ResourcesGLTF} from "../Loading/ResourcesMap";
import {GLTFModels} from "../Enums/Models";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";

export class MainScene extends Group{

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _transformControls: TransformControlService,
              private readonly _camera: PerspectiveCamera) {
    super();

    this.init();
  }

  private init() {

    const light = new AmbientLight(0xffffff, 3);
    const room = ResourcesGLTF.get(GLTFModels.Room)!;
    room.scene.scale.set(0.1, 0.1, 0.1);

    this._threeJS.scene.background = new Color(0x000000);

    this._transformControls.orbitControls.target.set(0, 0, 0);
    this._camera.position.set(10, 20, 60);
    this._transformControls.orbitControls.update();

    this._threeJS.scene.add(light)
    this._threeJS.scene.add(room.scene);


  }
}
