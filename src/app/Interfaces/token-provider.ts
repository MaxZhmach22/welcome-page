import {InjectionToken} from "@angular/core";
import {IUpdate} from "./IUpdate";
import {IThreeJSInit} from "./IThreeJSInit";


export const ON_GAME_UPDATE = new InjectionToken<IUpdate[]>('ON_GAME_UPDATE');
export const ON_THREE_JS_INIT = new InjectionToken<IThreeJSInit[]>('ON_THREE_JS_INIT');


