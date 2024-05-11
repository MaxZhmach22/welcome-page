import {Images} from "../Enums/Images";
import {Vector3} from "three";

export const InfoPoints = new Map<number, Point>([
    [1, {
        hintMessage: 'My skills, education and hobbies.🎓',
        attachedMeshName: 'Point_00'
    }],
    [2, {
        hintMessage: 'Play my dune game! 🏖️  This game was made with Unity. I used the LeoLiteECS framework, a bit of UniRX, and UniTask. The goal of the game is simple: gather 300 spice for the Emperor, but be careful, the Shai-Hulud are not asleep!',
        attachedMeshName: 'Point_01',
    }],
    [3, {
        hintMessage: 'Here are presented the games 🎮 of my childhood and the games that had a major influence on me.',
        attachedMeshName: 'Point_02',
    }],
    [4, {
        hintMessage: 'A little about this site: You probably noticed the absence of the standard Unity greeting when the site was loading (alas, I don’t have the pro license from Unity :) ), that’s because this site was developed using Three.js technology. It\'s a lightweight open-source technology that I, in turn, wrapped in the Angular framework for the convenience of working with the frontend. I made the room model and all the details in Blender. It\'s an approximate replica of my childhood room. The whole project is just about 10 MB in size. And for the convenience of deployment on the server, I used Docker container technology. Links to these projects are available on my Github. Thank you for your time! Enjoy!',
        attachedMeshName: 'Point_03',
    }],
    [5, {
      hintMessage: 'A little about this site: You probably noticed the absence of the standard Unity greeting when the site was loading (alas, I don’t have the pro license from Unity :) ), that’s because this site was developed using Three.js technology. It\'s a lightweight open-source technology that I, in turn, wrapped in the Angular framework for the convenience of working with the frontend. I made the room model and all the details in Blender. It\'s an approximate replica of my childhood room. The whole project is just about 10 MB in size. And for the convenience of deployment on the server, I used Docker container technology. Links to these projects are available on my Github. Thank you for your time! Enjoy!',
      attachedMeshName: 'MainPoint',
    }]
])

export interface Point {
    hintMessage: string,
    attachedMeshName: string,
    position?: {
      pointOfView: Vector3,
      cameraPosition: Vector3
    }
}
