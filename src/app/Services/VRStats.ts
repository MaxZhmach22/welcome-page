import * as THREE from "three";
import {Mesh} from "three";
import {IThreeJS} from "../Interfaces/IThreeJS";

export class VRStats extends THREE.Group {

  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;

  private last: number;
  private lastFrame: number;
  private customProps: any;
  private cmesh: any;

  constructor(private readonly threeJs: IThreeJS){
    super();
    this.renderer = threeJs.renderer;
    const can = this.canvas = document.createElement('canvas')
    console.log("canvas",can)
    can.width = 256
    can.height = 128
    const c = this.canvas.getContext('2d')
    c!.fillStyle = '#00ffff'
    c!.fillRect(0,0,can.width,can.height)
    const ctex = new THREE.CanvasTexture(can)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1,0.5),
      // new THREE.BoxGeometry(1,0.5,0.1),
      new THREE.MeshBasicMaterial({map:ctex})
    )
    mesh.position.z = -3
    mesh.position.y = 1.5
    mesh.material.depthTest = false
    mesh.material.depthWrite = false
    mesh.renderOrder = 1000
    this.add(mesh)
    this.cmesh = mesh

    this.last = 0
    this.lastFrame = 0
    this.customProps = {}
  }

  update(time: number) {
    if(time - this.last > 300) {
      // console.log("updating",this.rendereer.info)
      // console.log(`stats calls:`,this.renderer.info)

      const fps = ((this.renderer.info.render.frame - this.lastFrame)*1000)/(time-this.last)
      // console.log(fps)

      const c = this.canvas.getContext('2d')
      c!.fillStyle = 'white'
      c!.fillRect(0, 0, this.canvas.width, this.canvas.height)
      c!.fillStyle = 'black'
      c!.font = '16pt sans-serif'
      c!.fillText(`calls: ${this.renderer.info.render.calls}`, 3, 20)
      c!.fillText(`tris : ${this.renderer.info.render.triangles}`, 3, 40)
      c!.fillText(`fps : ${fps.toFixed(2)}`,3,60)
      Object.keys(this.customProps).forEach((key,i) => {
        const val = this.customProps[key]
        c!.fillText(`${key} : ${val}`,3,80+i*20)
      })
      this.cmesh.material.map.needsUpdate = true
      this.last = time
      this.lastFrame = this.renderer.info.render.frame
    }
  }

  setProperty(name: any, value: any) {
    this.customProps[name] = value
  }

}

export const Ray = THREE.Ray
/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */

export const Vector2 = THREE.Vector2;

export const on = (elem: any, type: string, cb: any): void => {
  elem.addEventListener(type, cb);
};
