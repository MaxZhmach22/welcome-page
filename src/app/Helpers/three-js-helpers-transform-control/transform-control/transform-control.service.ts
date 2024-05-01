import { Injectable } from '@angular/core';
import {MathUtils, Object3D, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

@Injectable({providedIn: 'root'})
export class TransformControlService {

  private _transformControls!: TransformControls;
  private _threeJS!: {
    scene: Scene;
    renderer: WebGLRenderer;
  }
  private _camera!: PerspectiveCamera;
  private _orbitControls!: OrbitControls;
  private _attachedObjects: Object3D[] = [];

  get orbitControls(): OrbitControls {
    return this._orbitControls;
  }

  /**
   * Init method need to be called before using this service
   * @param scene
   * @param camera
   * @param renderer
   */
  init(scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer) {

    this._threeJS = {
      scene: scene,
      renderer: renderer
    }
    this._camera = camera;

    const controls = new OrbitControls( this._camera, this._threeJS.renderer.domElement );
    controls.listenToKeyEvents( window ); // optional
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 500;
    controls.zoomSpeed = 4;
    controls.maxPolarAngle = Math.PI / 2;
    this._orbitControls = controls;

    this._transformControls = new TransformControls( this._camera, this._threeJS.renderer.domElement );
    this._transformControls.addEventListener( 'change', () => this._threeJS!.renderer.render(this._threeJS!.scene, this._camera) );
    this._transformControls.addEventListener( 'dragging-changed', ( event ) => {
      controls.enabled = ! event.value;
    } );

    this._threeJS.scene.add( this._transformControls );
    window.addEventListener( 'keydown',  ( event ) => {

      switch ( event.keyCode ) {

        case 81: // Q
          this._transformControls.setSpace( this._transformControls.space === 'local' ? 'world' : 'local' );
          break;

        case 16: // Shift
          this._transformControls.setTranslationSnap( 100 );
          this._transformControls.setRotationSnap( MathUtils.degToRad( 15 ) );
          this._transformControls.setScaleSnap( 0.25 );
          break;

        case 87: // W
          this._transformControls.setMode( 'translate' );
          break;

        case 69: // E
          this._transformControls.setMode( 'rotate' );
          break;

        case 82: // Rr
          this._transformControls.setMode( 'scale' );
          break;

        case 187:
        case 107: // +, =, num+
          this._transformControls.setSize( this._transformControls.size + 0.1 );
          break;

        case 189:
        case 109: // -, _, num-
          this._transformControls.setSize( Math.max( this._transformControls.size - 0.1, 0.1 ) );
          break;

        case 88: // X
          this._transformControls.showX = ! this._transformControls.showX;
          break;

        case 89: // Y
          this._transformControls.showY = ! this._transformControls.showY;
          break;

        case 90: // Z
          this._transformControls.showZ = ! this._transformControls.showZ;
          break;

        case 32: // Spacebar
          this._transformControls.enabled = ! this._transformControls.enabled;
          break;

        case 27: // Esc
          this._transformControls.reset();
          break;

      }

    } );
    window.addEventListener( 'keyup',  ( event ) => {

      switch ( event.keyCode ) {

        case 16: // Shift
          this._transformControls.setTranslationSnap( null );
          this._transformControls.setRotationSnap( null );
          this._transformControls.setScaleSnap( null );
          break;

      }
    } );
  }

  /**
   * Update method need to be called in the animation loop
   */
  update() {
    this._orbitControls.update();
  }

  /**
   * Attach object to transform controls
   * @param object
   */
  attach(object: Object3D) {
    this.detach();
    this._transformControls.attach(object);
    this._attachedObjects.push(object);
  }

  /**
   * Detach object from transform controls
   */
  detach() {
    this._attachedObjects.forEach(o => this._transformControls.remove(o));
  }
}
