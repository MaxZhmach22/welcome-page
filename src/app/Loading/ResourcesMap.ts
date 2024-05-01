import {GLTFModels} from "../Enums/Models";
import {Images} from "../Enums/Images";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Texture} from "three";

export const ResourcesGLTF = new Map<GLTFModels, GLTF>();
export const ResourcesTextures = new Map<Images, Texture>();
