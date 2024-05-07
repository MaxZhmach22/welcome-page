import {Group, PerspectiveCamera, Vector3} from "three";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";

export class CameraMovementSystem{

  private _speed = 0.05;
  private _direction = {x: 0, y: 1.5, z: 0};
  private _sensitivity = 1000;

  constructor(private readonly _camera: PerspectiveCamera,
              private readonly _transformControls: TransformControlService){

    this._transformControls.orbitControls.target.set(this._direction.x, 1.5, this._direction.y);

  }

  update(dl: number): void {


  }

}


