import {
  AmbientLight,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  SRGBColorSpace, Vector2,
  Vector3
} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";
import {ResourcesGLTF, ResourcesTextures} from "../Loading/ResourcesMap";
import {GLTFModels} from "../Enums/Models";
import {
  TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Images} from "../Enums/Images";
import {Layers} from "../Enums/Layers";
import {InfoPoints} from "../Configurations/InfoPoints";
import {ElementRef, QueryList} from "@angular/core";

export class MainScene extends Group {


  private _pointsOfInterest: PointOfInterest[] = []

  //Update
  private _frameCounter = 0;
  private _skipFactor = {value: 0.015};
  private _raycaster: Raycaster = new Raycaster();
  private _distanceDeadZone = {value: 4}

  constructor(private readonly _threeJS: IThreeJS,
              private readonly _transformControls: TransformControlService,
              private readonly _camera: PerspectiveCamera,
              private readonly pointsRef: QueryList<ElementRef>,
              private readonly lablesRef: QueryList<ElementRef>) {
    super();

    this.init();
  }

  private init() {

    const light = new AmbientLight(0xffffff, 3);
    const room = ResourcesGLTF.get(GLTFModels.Room)!;

    this.setRoomMaterials(room);

    console.log(room)
    room.scene.scale.set(1, 1, 1);

    const group = new Group();

    for (let i = 0; i < 5; i++) {
      const point = new Group();
      point.position.set(i, 0, 0);
      point.name = `Point_0${i}`;
      group.add(point)
    }

    this.add(group)

    this.setRaycastSettings()
    this.constructHtmlPointsOfInterest(this.pointsRef, this.lablesRef, this.constructPointsOfInterest(group));

    this._threeJS.scene.background = new Color(0x000000);

    this._transformControls.orbitControls.target.set(0, 1.5, 0);
    this._camera.position.set(2.5, 4, 3);
    this._transformControls.orbitControls.update();

    this._threeJS.scene.add(light)
    this._threeJS.scene.add(room.scene);


  }

  private setRoomMaterials(room: GLTF) {

    room.scene.traverse((child) => {
      if (child instanceof Mesh) {

        if (child.name === 'Walls' || child.name === "Floor" || child.name === "Window") {
          const wallsTexture = ResourcesTextures.get(Images.WallsFloor)!;
          wallsTexture.flipY = false;
          wallsTexture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: wallsTexture})
        } else if (child.name === 'Decor') {
          const decor = ResourcesTextures.get(Images.Decor)!;
          decor.flipY = false;
          decor.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: decor})
        } else if (child.name === 'Funuture') {
          const funuture = ResourcesTextures.get(Images.Funuture)!;
          funuture.flipY = false;
          funuture.colorSpace = SRGBColorSpace
          child.material = new MeshBasicMaterial({map: funuture})
        }
        console.log(child.name)
      }
    })
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
                hintPosition: lookPoint.localToWorld(new Vector3(0, 0, 0)),
                //orbitControlsConfig: orbitControlsConstants
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


  update(dt: number) {
    if (!this.visible) return;
    if (this._pointsOfInterest.length == 0) return;
    this._frameCounter += dt;
    const offset = 0.6;
    if (this._frameCounter >= this._skipFactor.value) {
      this._frameCounter = 0;

      for (const point of this._pointsOfInterest) {
        const screenPosition = point.pictureInfo.hintPosition.clone();
        screenPosition.project(this._camera);

        const outOfScreen = screenPosition.x < -offset
          || screenPosition.x > offset
          || screenPosition.y < -offset
          || screenPosition.y > offset;

        if (!outOfScreen) {
          this.setVisibility(point.element, true)
          this.setVisibility(point.lable, true)
          this.movingHtmlElements(screenPosition, point)
          const translateX = screenPosition.x * this._threeJS.renderer.domElement.clientWidth * 0.5;
          const translateY = -screenPosition.y * this._threeJS.renderer.domElement.clientHeight * 0.5;
          if (point.element) {
            point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
          }
        } else {
          this.setVisibility(point.element, false)
        }
      }
    }
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
    const translateX = screenPosition.x * this._threeJS.renderer.domElement.clientWidth * 0.5;
    const translateY = -screenPosition.y * this._threeJS.renderer.domElement.clientHeight * 0.5;
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
  //orbitControlsConfig: OrbitControlsConstants
}
export interface PointOfInterest {
  pictureInfo: PictureInfoCoordinates
  element: any,
  lable: any
}
