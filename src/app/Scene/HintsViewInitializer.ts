import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {Frustum, Group, Matrix4, PerspectiveCamera, Raycaster, Vector2, Vector3} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {ElementRef, QueryList} from "@angular/core";
import {Layers} from "../Enums/Layers";
import {InfoPoints} from "../Configurations/InfoPoints";


export class HintsViewInitializer {

  private _pointsOfInterest: PointOfInterest[] = []

  //Update
  private _frameCounter = 0;
  private _skipFactor = {value: 0.015};
  private _raycaster: Raycaster = new Raycaster();
  private _frustum = new Frustum();

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _transformControls: TransformControlService,
              private readonly _camera: PerspectiveCamera,
              private readonly _roomModel: Group,
              private readonly pointsRef: QueryList<ElementRef>,
              private readonly lablesRef: QueryList<ElementRef>){
  }

  init(group: Group) {

    for (let i = 0; i < 4; i++) {
      const point = new Group();
      const position = InfoPoints.get(i + 1)!.position;
      point.position.set(position!.pointOfView.x, position!.pointOfView.y, position!.pointOfView.z);
      point.name = `Point_0${i}`;
      group.add(point)
    }

    this.setRaycastSettings()
    this.constructHtmlPointsOfInterest(this.pointsRef, this.lablesRef, this.constructPointsOfInterest(group));
  }

  update(dt: number) {
    if (this._pointsOfInterest.length == 0) return;
    this._frameCounter += dt;
    const offset = 0.8;
    if (this._frameCounter >= this._skipFactor.value) {
      this._frameCounter = 0;

      for (const point of this._pointsOfInterest) {
        const screenPosition = point.pictureInfo.position.pointOfView.clone()
        screenPosition.project(this._camera);

        this._frustum.setFromProjectionMatrix(new Matrix4().multiplyMatrices(this._camera.projectionMatrix, this._camera.matrixWorldInverse));

        const isInFrustum = this._frustum.containsPoint(point.pictureInfo.position.pointOfView);

        const isToFar = point.pictureInfo.position.pointOfView.distanceTo(this._camera.position) > 16;


        const outOfScreen = screenPosition.x < -offset
          || screenPosition.x > offset
          || screenPosition.y < -offset
          || screenPosition.y > offset


        if (!outOfScreen && isInFrustum && !isToFar) {
          this.setVisibility(point.element, true)
          this.setVisibility(point.lable, true)
          this.movingHtmlElements(screenPosition, point)
        } else {
          this.setVisibility(point.element, false)
          this.setVisibility(point.lable, false)
        }
      }
    }
  }

  private constructPointsOfInterest(points: Group,) {
    const coordinates: PictureInfoCoordinates[] = [];
    points.layers.set(Layers.PointsOfInterest);
    let i = 0;
    for (const [step, point] of InfoPoints) {
      points.traverse((child) => {
        if (child.name.includes(point.attachedMeshName)) {
          i++;
          //TODO здесь добавить ограничения по осям
          //const orbitControlsConstants = this.defineOrbitControlsConstants(step)

          //TODO Сконструировать подсказки
          const lookPoint = child;
          if (lookPoint) {
            {
              coordinates.push({
                name: child.name,
                cameraPosition: child.localToWorld(new Vector3(0, 2, 0)),
                lookAtPosition: child.localToWorld(new Vector3(0, 0, 0)),
                hintPosition: child.getWorldPosition(new Vector3()),
                position: point.position!,
              });
            }
          }
        }
      })
    }

    return coordinates;
  }

  private constructHtmlPointsOfInterest(pointsRef: QueryList<ElementRef>, lablesRef: QueryList<ElementRef>, coordinates: PictureInfoCoordinates[]) {
    pointsRef.forEach((point, index) => {
      const pictureInfo = coordinates[index];
      this._pointsOfInterest.push({
        pictureInfo: pictureInfo,
        element: point.nativeElement,
        lable: lablesRef.toArray()[index].nativeElement
      })
    })
  }

  private setVisibility(element: any, state: boolean) {
    if (element.classList.contains('visible') === state) return;
    if (state) {
      element.classList.add('visible')
    } else {
      element.classList.remove('visible')
    }
  }

  private movingHtmlElements(screenPosition: Vector3, point: PointOfInterest) {
    const translateX = screenPosition.x * this._threeJS.renderer.domElement.clientWidth / 2;
    const translateY = -screenPosition.y * this._threeJS.renderer.domElement.clientHeight / 2;
    if (point.element) {
      point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    }
  }

  private setRaycastSettings() {
    this._raycaster.near = 1;
    this._raycaster.far = 100;
    this._raycaster.layers.set(Layers.PointsOfInterest)
  }


}


export interface PictureInfoCoordinates {
  name: string,
  cameraPosition: Vector3,
  lookAtPosition: Vector3,
  hintPosition: Vector3,
  position: {
    pointOfView: Vector3,
    cameraPosition: Vector3
  }
  //orbitControlsConfig: OrbitControlsConstants
}

export interface PointOfInterest {
  pictureInfo: PictureInfoCoordinates
  element: any,
  lable: any
}

