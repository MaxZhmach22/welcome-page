import {Images} from "../Enums/Images";
import {Vector3} from "three";

export const InfoPoints = new Map<number, Point>([
    [1, {
        hintMessage: 'Resume',
        attachedMeshName: 'Point_00',
        position: new Vector3(-3, 2.5, 3)
    }],
    [2, {
        hintMessage: 'Play my dune game! 🏖️',
        attachedMeshName: 'Point_01',
        position: new Vector3(-3.2, 2.2, 0)
    }],
    [3, {
        hintMessage: 'My favorite games! 🎮',
        attachedMeshName: 'Point_02',
        position: new Vector3(-1.5, 2, -3.5)
    }],
    [4, {
        hintMessage: 'Where I live 🏠',
        attachedMeshName: 'Point_03',
        position: new Vector3(2.5, 2.2, -4)
    }]
])

export interface Point {
    hintMessage: string,
    attachedMeshName: string,
    position: Vector3
}
