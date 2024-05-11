import {Images} from "../Enums/Images";
import {Vector3} from "three";

export const InfoPoints = new Map<number, Point>([
  [1, {
    hintMessage: 'Hello, my name is Max, and I am a game developer. Since childhood, games have occupied a large part of my life, and, of course, I dreamed of developing them and working with 3D graphics. An entire immense world inside a little white box. Tempting. As time went by, my range of interests expanded, and another thing captivated me just as much as games—namely, music. I learned to play the saxophone, received a professional musical education, worked in orchestras, bands, and solo, taught in music schools, and gave private lessons. During the COVID pandemic, like the rest of the world, I was staying at home, and it was then that I decided to change my profession to a game developer, something I had dreamed of in childhood. I enrolled in GeekBrains courses for game development with Unity, and within a year, I had already received a job offer from Octavian Game Arts to develop casual games for mobile devices. After a year, as the department was disbanded, I was transferred to the online game development department using the Pixi.js engine, and a little bit of Three.js. Two years later, I still work in this department. I have mastered technologies such as Angular, Docker, Three.js/Pixi.js, expanded my skills in Unity, and shader writing. At the moment, my home projects are related to the development of VR applications. I hope that soon there will be a link here to one of the projects :)',
    attachedMeshName: 'Point_00'
  }],
  [2, {
    hintMessage: 'Play my dune game! 🏖️  This game was made with Unity. I used the LeoLiteECS framework, a bit of UniRX, and UniTask. The goal of the game is simple: gather 300 spice for the Emperor, but be careful, the Shai-Hulud are not asleep! Touch screen to enter the game.',
    attachedMeshName: 'Point_01',
  }],
  [3, {
    hintMessage: 'Here are presented the games 🎮 of my childhood and the games that had a major influence on me.',
    attachedMeshName: 'Point_02',
  }],
  [4, {
    hintMessage: 'A little about this site: You probably noticed the absence of the standard Unity greeting when the site was loading (alas, I don’t have the pro license from Unity :) ), that’s because this site was developed using Three.js technology. It\'s a lightweight open-source technology that I, in turn, wrapped in the Angular framework for the convenience of working with the frontend. I made the room model and all the details in Blender. It\'s an approximate replica of my childhood room. The whole project is just about 13 MB in size. And for the convenience of deployment on the server, I used Docker container technology. Links to these projects are available on my Github. Thank you for your time! Enjoy!',
    attachedMeshName: 'Point_03',
  }],
  [5, {
    hintMessage: '',
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
