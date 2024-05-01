export class Config {

  //Orbit controls settings
  public static OrbitConfig = {
    enable: true,
    enableDamping: true,
    dampingFactor: 0.1,
    screenSpacePanning: false,
    enableZoom: true,
    minDistance: 0,
    maxDistance: 3,
    maxPolarAngle: 2,
    minPolarAngle: 0.5,
    maxAzimuthAngle: 2.7,
    minAzimuthAngle: 0.5
  }

  public static FreeOrbitConfig = {
    enable: true,
    enableDamping: true,
    dampingFactor: 0.1,
    enableZoom: true,
    minDistance: 0,
    maxDistance: 5,
    maxPolarAngle: 2,
    minPolarAngle: 0.5,
    maxAzimuthAngle: Infinity,
    minAzimuthAngle: -Infinity
  }
}
