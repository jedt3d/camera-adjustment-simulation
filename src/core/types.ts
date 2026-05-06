// Copyrights © 2026 by Worajedt Sitthidumrong

export type SensorKey = 'full-frame' | 'aps-c' | 'mft';

export type SensorPreset = {
  label: string;
  widthMm: number;
  cocMm: number;
};

export type AppState = {
  focalLengthMm: number;
  focusDistanceM: number;
  subjectDistanceM: number;
  backgroundDistanceM: number;
  aperture: number;
  sensor: SensorKey;
  shutterSpeedS: number;
  iso: number;
  bokehBlades: number;
};

export type PageKey =
  | 'exposure'
  | 'perspective'
  | 'depth'
  | 'liveview'
  | 'sensorCrop'
  | 'bokeh'
  | 'zoneFocus'
  | 'lensDistortion';

export type OpticalModel = {
  focalLengthMm: number;
  focusDistanceMm: number;
  objectFocusDistanceMm: number;
  imageDistanceMm: number;
  hyperfocalMm: number;
  nearLimitMm: number;
  farLimitMm: number;
  actualDofMm: number;
  aperture: number;
  focusDistanceM: number;
  subjectDistanceM: number;
  backgroundDistanceM: number;
  sensorX: number;
  mountX: number;
  opticalCenterX: number;
  focusX: number;
  subjectX: number;
  backgroundX: number;
  nearX: number;
  farX: number;
  fovHalfAngleRad: number;
  sensor: SensorPreset;
};
