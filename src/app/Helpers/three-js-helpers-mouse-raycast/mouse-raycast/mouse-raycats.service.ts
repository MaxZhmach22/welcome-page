import {Injectable} from '@angular/core';
import {Object3D, PerspectiveCamera, Raycaster, Vector2} from "three";
import {Object3DHoverState} from "./Object3DHoverState";

@Injectable({providedIn: 'root'})
export class MouseRaycatsService {

  private readonly _mousePosition = new Vector2()
  private readonly _raycaster = new Raycaster();
  private readonly _objectsToIntersects: Object3D[] = [];
  private readonly _objects = new Map<Object3D, Object3DHoverState>();

  private _camera!: PerspectiveCamera;
  private _isInit = false;

  get mousePosition(): Vector2 {
    return this._mousePosition;
  }

  get raycaster(): Raycaster {
    return this._raycaster;
  }

  init(camera: PerspectiveCamera) {
    this.subscribeOnMouseMove();
    this._camera = camera;
    this._isInit = true;
  }

  addObjectsToIntersect(objects: Object3D[]) {
    objects.forEach(o => {
      const hoverState: Object3DHoverState = {mouseout: false, mouseenter: false, mouseclick: false};
      this._objects.set(o, hoverState);
    })
    this._objectsToIntersects.push(...objects);
  }

  removeObjectsToIntersect(objects: Object3D[]) {
    for (const object of objects) {
      const index = this._objectsToIntersects.indexOf(object);
      if (index > -1) this._objectsToIntersects.splice(index, 1);
    }
  }

  private subscribeOnMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this._mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this._mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    })

    window.addEventListener('click', (event) => {
      this._objects.forEach((hoverState, object) => {
        if(hoverState.mouseenter){
          hoverState.mouseclick = true;
        }
      })
    })
  }

  update(dt: number) {
    if (!this._isInit) throw new Error('MouseRaycastService is not initialized');

    this._raycaster.setFromCamera(this._mousePosition, this._camera);
    if (this._objectsToIntersects.length === 0) return;
    const intersects = this._raycaster.intersectObjects(this._objectsToIntersects, true);

    for (const intersect of intersects) {
      const hoverState = this._objects.get(intersect.object)!;
      if (!hoverState.mouseenter) {
        intersect.object.dispatchEvent({type: "mouseenter", target: intersect.object, state: hoverState});
        hoverState.mouseenter = true;
      }
    }

    for (const intersect of intersects) {
      const hoverState = this._objects.get(intersect.object)!;
      if (hoverState.mouseclick) {
        intersect.object.dispatchEvent({type: "mouseclick", target: intersect.object, state: hoverState});
        hoverState.mouseclick = false;
      }
    }

    const objects = intersects.map(i => i.object);
    const nonIntersects = this._objectsToIntersects.filter(o => !objects.includes(o));

    for (const nonIntersect of nonIntersects) {
      const hoverState = this._objects.get(nonIntersect)!;
      if (hoverState.mouseenter) {
        hoverState.mouseout = true;
        nonIntersect.dispatchEvent({type: "mouseout", target: nonIntersect, state: hoverState});
        hoverState.mouseenter = false;
      }
    }
  }
}

