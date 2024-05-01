import 'three';
import {Object3D} from "three";
import {Object3DHoverState} from "./Object3DHoverState";

declare module 'three' {
  export interface Object3DEventMap {
    mouseenter: { target: Object3D, state: Object3DHoverState };
    mouseout: { target: Object3D, state: Object3DHoverState };
    mouseclick: { target: Object3D, state: Object3DHoverState };
  }
}
