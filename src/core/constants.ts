// Copyrights © 2026 by Worajedt Sitthidumrong

import type { AppState, SensorKey, SensorPreset } from './types';

export const sensors: Record<SensorKey, SensorPreset> = {
  'full-frame': { label: 'Full frame', widthMm: 36, cocMm: 0.03 },
  'aps-c': { label: 'APS-C', widthMm: 23.5, cocMm: 0.02 },
  mft: { label: 'Micro Four Thirds', widthMm: 17.3, cocMm: 0.015 },
};

export const focalSteps = [12, 14, 16, 18, 20, 21, 24, 28, 35, 40, 50, 58, 70, 85, 100, 105, 120, 135];
export const apertureSteps = [
  1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.5, 2.8, 3.2, 3.5, 4, 4.5, 5, 5.6, 6.3, 7.1, 8, 9, 10, 11, 13, 14, 16,
];
export const shutterSteps = [
  1 / 4000,
  1 / 2000,
  1 / 1000,
  1 / 500,
  1 / 250,
  1 / 125,
  1 / 60,
  1 / 30,
  1 / 15,
  1 / 8,
  1 / 4,
  1 / 2,
  1,
  2,
];
export const isoSteps = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
export const infinityFocusValue = 30.1;

export const world = {
  width: 1920,
  height: 620,
  sensorX: 86,
  mountX: 140,
  axisY: 308,
  backgroundHeight: 250,
  fovReach: 1860,
  metersToPx: 84,
  mmToPx: 1.45,
};

export const defaultState: AppState = {
  focalLengthMm: 50,
  focusDistanceM: 5,
  subjectDistanceM: 5,
  backgroundDistanceM: 15,
  aperture: 4,
  sensor: 'full-frame',
  shutterSpeedS: 1 / 125,
  iso: 400,
  bokehBlades: 7,
};
