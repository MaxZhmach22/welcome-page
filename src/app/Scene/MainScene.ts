import {AmbientLight, Color, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, SRGBColorSpace} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {ResourcesGLTF, ResourcesTextures} from "../Loading/ResourcesMap";
import {GLTFModels} from "../Enums/Models";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Images} from "../Enums/Images";

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

    this.setRoomMaterials(room);

    console.log(room)
    room.scene.scale.set(1, 1, 1);

    this._threeJS.scene.background = new Color(0x000000);

    this._transformControls.orbitControls.target.set(0, 1.5, 0);
    this._camera.position.set(2.5, 4, 3);
    this._transformControls.orbitControls.update();

    this._threeJS.scene.add(light)
    this._threeJS.scene.add(room.scene);


  }

  private setRoomMaterials(room: GLTF) {

    room.scene.traverse((child) => {
      if (child instanceof Mesh) {

        if(child.name === 'Walls' || child.name === "Floor" || child.name === "Window"){
          const wallsTexture = ResourcesTextures.get(Images.WallsFloor)!;
          wallsTexture.flipY = false;
          wallsTexture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: wallsTexture})
        }
        else if(child.name === 'Decor'){
          const decor = ResourcesTextures.get(Images.Decor)!;
          decor.flipY = false;
          decor.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: decor})
        }

        else if(child.name === 'Funuture'){
          const funuture = ResourcesTextures.get(Images.Funuture)!;
          funuture.flipY = false;
          funuture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: funuture})
        }


        console.log(child.name)
      }
    })
  }
}
