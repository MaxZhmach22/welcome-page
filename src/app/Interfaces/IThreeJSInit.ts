import {IThreeJS} from "./IThreeJS";
import {PerspectiveCamera} from "three";

export interface IThreeJSInit{
  onThreeJSInit(threeJS: IThreeJS, camera: PerspectiveCamera): void;
}
