import {Group, PerspectiveCamera, Vector3} from "three";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {InfoPoints} from "../Configurations/InfoPoints";

export class CameraMovementSystem{

  constructor(private readonly _camera: PerspectiveCamera,
              private readonly _transformControls: TransformControlService){

    const point = InfoPoints.get(5)?.position?.pointOfView;
    const cameraPosition = InfoPoints.get(5)?.position?.cameraPosition;
    this._camera.position.set(cameraPosition!.x, cameraPosition!.y, cameraPosition!.z);
    this._transformControls.orbitControls.target.copy(point!);

    this._transformControls.orbitControls.update();
    this._transformControls.orbitControls.enableDamping = true;
    this._transformControls.orbitControls.dampingFactor = 0.1;
    this._transformControls.orbitControls.rotateSpeed = 0.15;
    //this._transformControls.orbitControls.enablePan = false;
  }


  update(dt: number): void {
    this._transformControls.orbitControls.update(dt);
  }

}


