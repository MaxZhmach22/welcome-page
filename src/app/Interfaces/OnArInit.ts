import {IThreeJS} from "./IThreeJS";
import {Camera} from "three";

export interface OnArInit{
  onVRInit(info: IThreeJS): Camera;
}
