import { Injectable } from '@angular/core';
import GUI from "lil-gui";
import {Object3D} from "three";

@Injectable({
  providedIn: 'root'
})
export class GuiInfoPanelService {

  get gui(): GUI {
    return this._gui;
  }

  private _gui = new GUI();
  private _addedObjects = new Map<number, {folder: GUI, object: Object3D}>();

  constructor() {}

  add(object: Object3D) {
    if(this._addedObjects.has(object.id)) return;
    const folder = this._gui.addFolder(object.name === '' ? object.type : object.name);
    this._addedObjects.set(object.id, {folder, object});
    this.createSimpleControllers(object, folder);
  }

  private createSimpleControllers(object: Object3D, folder: GUI) {

    folder.add(object, 'visible').name('Visible');
    const position = folder.addFolder('Position');
    position.add(object.position, 'x').name('X').decimals(3).listen();
    position.add(object.position, 'y').name('Y').decimals(3).listen();
    position.add(object.position, 'z').name('Z').decimals(3).listen();
    const rotation = folder.addFolder('Rotation');
    rotation.add(object.rotation, 'x').name('X').decimals(3).listen();
    rotation.add(object.rotation, 'y').name('Y').decimals(3).listen();
    rotation.add(object.rotation, 'z').name('Z').decimals(3).listen();
    const scale = folder.addFolder('Scale');
    scale.add(object.scale, 'x', ).name('X').decimals(3).listen();
    scale.add(object.scale, 'y', ).name('Y').decimals(3).listen();
    scale.add(object.scale, 'z').name('Z').decimals(3).listen();

    let functions = {
     savePreset: () => {
       const info = {position: object.position, rotation: object.rotation, scale: object.scale};
       console.log('Save preset:', info)
     }
    }

    folder.add(functions, 'savePreset').name('Copy to buffer');
  }

  remove(object: Object3D) {
    if(!this._addedObjects.has(object.id)) return;
    const folder = this._addedObjects.get(object.id)!.folder;
    folder.destroy();
    this._addedObjects.delete(object.id);
  }
}
