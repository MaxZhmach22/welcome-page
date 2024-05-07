import {Group, PerspectiveCamera, Vector3} from "three";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";

export class CameraMovementSystem{

  constructor(private readonly _camera: PerspectiveCamera,
              private readonly _transformControls: TransformControlService){

    this._camera.position.set(2.03, 3.12,  2.44);
    this._transformControls.orbitControls.target.set(-4, 0, -4);
    this._transformControls.orbitControls.update();
    this._transformControls.orbitControls.enableDamping = true;
    this._transformControls.orbitControls.dampingFactor = 0.1;
    this._transformControls.orbitControls.rotateSpeed = 0.15;
    this._transformControls.orbitControls.enablePan = false;
  }


  update(dt: number): void {
    this._transformControls.orbitControls.update(dt);
  }

}


