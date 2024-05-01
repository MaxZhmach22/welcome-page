import {Injectable} from "@angular/core";
import {EngineService} from "./EngineService";
import {Audio, AudioListener, PerspectiveCamera} from "three";
import {Sounds} from "../Enums/Sounds";
import {SoundsBufferList} from "../Enums/SoundsList";

@Injectable({providedIn: 'root'})
export class AudioService{

    private _audioListener: AudioListener | null = null;
    private _loopSound: Audio | null = null;

    private _isPlaying = false;
    private _engineService: EngineService | null = null;
    private _isLoading: boolean = false;

    get isPlaying(): boolean {
        return this._isPlaying;
    }

    constructor() {}

    async init(engineService: EngineService){
        this._engineService = engineService;

        window.addEventListener('blur', () => {
            //this.stopLoopSound();
        })
        window.addEventListener('focus', () => {
/*            if(this._audioListener || !this._loopSound && this._isPlaying){
                if(this._loopSound?.getVolume() != 0) this.playLoopSound();
            }*/
        });
    }

    async playLoopSound(){

        if(!this._audioListener || !this._loopSound) {
            await this.createListener()
        };

        if(this._isPlaying) return;
        this._isPlaying = true;
        this._loopSound!.setLoop(true);
        this._loopSound!.setVolume(0.5);
        this._loopSound!.play();
    }

    async stopLoopSound(){
        if(!this._audioListener || !this._loopSound) {
            await this.createListener()
        };
        if(!this._isPlaying) return;
        this._isPlaying = false;
        this._loopSound!.stop();
    }

    async setMute(mute: boolean){
        if(!this._audioListener || !this._loopSound) {
            await this.createListener()
        };
        if(!this._isPlaying) return;
        this._loopSound!.setVolume(mute ? 0 : 0.5);
    }

    private async createListener() {
        if(!this._engineService) throw new Error("EngineService is not initialized");

        if(this._isLoading) return;
        this._isLoading = true;

        this._audioListener = new AudioListener();
        this._loopSound = new Audio(this._audioListener);

        for (const resources of Object.keys(Sounds)) {
            const sound = await this._engineService.resourcesLoader.loadMusic(this._audioListener, Sounds[resources as keyof typeof Sounds]);
            SoundsBufferList.set(Sounds[resources as keyof typeof Sounds], sound);
        }

        this._engineService.camera.add(this._audioListener);
        //const buffer = SoundsBufferList.get(Sounds.Loop)!;
        //this._loopSound.setBuffer(buffer);
    }
}
