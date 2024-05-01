import {Injectable} from "@angular/core";
import {GLTF, GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Audio, AudioListener, AudioLoader, Group, LoadingManager, Object3DEventMap} from "three";
import {getKeyByValue} from "../Services/Utils";
import {GLTFModels} from "../Enums/Models";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

export class ResourcesLoader{

  private readonly _loaderManager = new LoadingManager();

  get loaderManager(): LoadingManager {
    return this._loaderManager;
  }

  async loadGLTFModel(model: GLTFModels, debug = true): Promise<GLTF>{
    return new Promise<any>((resolve, reject) => {
      const loader = new GLTFLoader(this._loaderManager);
      // Optional: Provide a DRACOLoader instance to decode compressed mesh data
      const dracoLoader = new DRACOLoader(this._loaderManager);
      dracoLoader.setDecoderPath( 'assets/draco/' );
      loader.setDRACOLoader(dracoLoader);

      loader.load(model, (gltf) => {
        gltf.scene.name = getKeyByValue(model);
        resolve(gltf);
      }, undefined, (error) => {
        reject(error);
      });
    });
  }

  async loadMusic(audioListener: AudioListener, audioPath: string): Promise<AudioBuffer> {
    const audioLoader = new AudioLoader(this._loaderManager);
    return await audioLoader.loadAsync(`${audioPath}`)
  }
}

export interface IFBXModel{
  model: Group<Object3DEventMap>,
  animations?: Group<Object3DEventMap>
}


