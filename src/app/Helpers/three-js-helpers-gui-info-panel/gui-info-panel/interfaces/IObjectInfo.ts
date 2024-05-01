export interface IObjectInfo {
  position: {
    x: number,
    y: number,
    z: number
  },
  rotation: {
    isEuler: true,
    x: number,
    y: number,
    z: number,
    order: string
  },
  scale: {
    x: number,
    y: number,
    z: number
  },
  visible: boolean,
}
