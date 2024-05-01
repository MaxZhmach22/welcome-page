import {IThreeJS} from "./IThreeJS";
import {Camera} from "three";

export interface OnVRInit{
  onVRInit(info: IThreeJS): Promise<Camera>;
}

