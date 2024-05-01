import {IUpdate} from "../Interfaces/IUpdate";
import {OnVRInit} from "../Interfaces/OnVRInit";
import {Camera} from "three";
import {Injectable} from "@angular/core";
import {IThreeJS} from "../Interfaces/IThreeJS";

@Injectable()
export abstract class AbstractExample implements OnVRInit, IUpdate{
  abstract onVRInit(info: IThreeJS): Promise<Camera>;
  abstract update(dt: number, frame?: XRFrame): void;
}
