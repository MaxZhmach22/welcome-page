
import {Intersection, Object3D, Scene} from "three";
import {GLTFModels} from "../Enums/Models";

export function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getKeyByValue(value: string): string {
  let enumKey;

  Object.keys(GLTFModels).forEach((key) => {
    if (GLTFModels[key as keyof typeof GLTFModels] === value) {
      enumKey = key;
    }
  });

  return enumKey ?? 'Name not found';
}

export function findObjectInIntersection(intersects: Intersection[], name: string): Object3D | undefined {

  if(intersects.length > 0){
    let intersection = intersects[0];
    let intersectedMesh: Object3D| null  = intersection.object;

    // Поднимаемся по иерархии на нужный уровень
    while(intersectedMesh && !(intersectedMesh instanceof Scene)) {
      if (intersectedMesh.name === name){
        return intersectedMesh;
      }
      intersectedMesh = intersectedMesh.parent;
    }

    return undefined;
  }




  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name === name) {
      return intersects[i].object;
    }
  }
  return undefined;
}
