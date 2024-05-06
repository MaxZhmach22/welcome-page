import {Images} from "../Enums/Images";

export const InfoPoints = new Map<number, Point>([
    [1, {
        hintMessage: 'Дома самый вкусный раф! ☕',
        attachedMeshName: 'Point_00'
    }],
    [2, {
        hintMessage: 'Жду завтрак. Обещают овсянку с персиками 😱😜❤️',
        attachedMeshName: 'Point_01'
    }],
    [3, {
        hintMessage: 'Сделала реснички и брови! Люблю комбо! 😜',
        attachedMeshName: 'Point_02'
    }],
    [4, {
        hintMessage: 'Вокруг одни олени! Я что, в сказке?! 😳',
        attachedMeshName: 'Point_03'
    }],
    [5, {
        hintMessage: 'Hi guys! Can I join your meeting? 🤗',
        attachedMeshName: 'Point_04'
    }]
])

export interface Point {
    hintMessage: string,
    attachedMeshName: string,
}
