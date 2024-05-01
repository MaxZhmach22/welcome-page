import {AfterViewInit, Injectable} from "@angular/core";
import {
    TransformControlService
} from "../Helpers/three-js-helpers-transform-control/transform-control/transform-control.service";
import {GuiInfoPanelService} from "../Helpers/three-js-helpers-gui-info-panel/gui-info-panel/gui-info-panel.service";
import GUI from "lil-gui";
import {Config} from "../Configurations/Config";
import {gsap} from "gsap";

@Injectable({providedIn: 'root'})
export class OrbitControlSettingsProvider{

    private orbitControlsFolder: GUI;

    constructor(private readonly transformControlService: TransformControlService,
                private readonly guiInfoPanelService: GuiInfoPanelService) {
        this.orbitControlsFolder = this.guiInfoPanelService.gui.addFolder('Orbit Controls');
    }

    init(){
        const orbitControls = this.transformControlService.orbitControls;
        orbitControls.enableDamping = Config.OrbitConfig.enableDamping;
        orbitControls.dampingFactor = Config.OrbitConfig.dampingFactor;
        orbitControls.enableZoom = Config.OrbitConfig.enableZoom;
        orbitControls.maxPolarAngle = Config.OrbitConfig.maxPolarAngle;
        orbitControls.minPolarAngle = Config.OrbitConfig.minPolarAngle;
        orbitControls.maxDistance = Config.OrbitConfig.maxDistance;
        orbitControls.minDistance = Config.OrbitConfig.minDistance;
        orbitControls.maxAzimuthAngle = Config.OrbitConfig.maxAzimuthAngle;
        orbitControls.minAzimuthAngle = Config.OrbitConfig.minAzimuthAngle;

        this.orbitControlsFolder.add(Config.OrbitConfig, 'enableDamping').name('Enable Damping').onChange((value: boolean) => {
            orbitControls.enableDamping = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'dampingFactor').name('Damping Factor').onChange((value: number) => {
            orbitControls.dampingFactor = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'enableZoom').name('Enable Zoom').onChange((value: boolean) => {
            orbitControls.enableZoom = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'maxPolarAngle').name('Max Polar Angle').onChange((value: number) => {
            orbitControls.maxPolarAngle = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'minPolarAngle').name('Min Polar Angle').onChange((value: number) => {
            orbitControls.minPolarAngle = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'maxDistance').name('Max Distance').onChange((value: number) => {
            orbitControls.maxDistance = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'minDistance').name('Min Distance').onChange((value: number) => {
            orbitControls.minDistance = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'maxAzimuthAngle').name('Max Azimuth Angle').onChange((value: number) => {
            orbitControls.maxAzimuthAngle = value;
        })
        this.orbitControlsFolder.add(Config.OrbitConfig, 'minAzimuthAngle').name('Min Azimuth Angle').onChange((value: number) => {
            orbitControls.minAzimuthAngle = value;
        })

        this.orbitControlsFolder.add(orbitControls, 'maxAzimuthAngle').name('Max Azimuth Angle').listen().disable(true)
        this.orbitControlsFolder.add(orbitControls, 'minAzimuthAngle').name('Min Azimuth Angle').listen().disable(true)
    }

  setFreeCamera() {
    const orbitControls = this.transformControlService.orbitControls;
    orbitControls.maxAzimuthAngle = Config.FreeOrbitConfig.maxAzimuthAngle;
    orbitControls.minAzimuthAngle = Config.FreeOrbitConfig.minAzimuthAngle;
    orbitControls.maxDistance = Config.FreeOrbitConfig.maxDistance
    orbitControls.minDistance = Config.FreeOrbitConfig.minDistance
    orbitControls.maxPolarAngle = Config.FreeOrbitConfig.maxPolarAngle;
    orbitControls.minPolarAngle = Config.FreeOrbitConfig.minPolarAngle;
  }
}
