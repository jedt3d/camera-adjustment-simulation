// Copyrights © 2026 by Worajedt Sitthidumrong

import { sensors } from './constants';
import { clamp } from './format';
import { getCropFactor, getDefocusAmount } from './optics';
import type { AppState, OpticalModel, SensorKey } from './types';

export function calculateExposureMetrics(state: AppState) {
  const baselineBrightness = ((1 / 125) * 400) / (4 * 4);
  const brightnessRatio = (state.shutterSpeedS * state.iso) / (state.aperture * state.aperture) / baselineBrightness;
  const stopDelta = Math.log2(brightnessRatio);
  const previewBrightness = clamp(0.58 + stopDelta * 0.16, 0.22, 1.8);
  const motionBlur = clamp(Math.log2(state.shutterSpeedS / (1 / 125)) * 4, 0, 32);
  const grainOpacity = clamp(Math.log2(state.iso / 100) * 0.085, 0, 0.56);
  const ev100 = Math.log2((state.aperture * state.aperture) / state.shutterSpeedS);
  const balanceX = 320 + clamp(stopDelta, -3, 3) * 58;

  return {
    balanceX,
    brightnessRatio,
    ev100,
    grainOpacity,
    motionBlur,
    previewBrightness,
    stopDelta,
  };
}

export function calculatePerspectiveMetrics(state: AppState) {
  const baselineSubjectScale = 50 / 5;
  const subjectFraming = state.focalLengthMm / state.subjectDistanceM / baselineSubjectScale;
  const subjectHeight = clamp(230 * subjectFraming, 92, 438);
  const subjectWidth = subjectHeight * 0.34;
  const backgroundFraming = state.focalLengthMm / state.backgroundDistanceM / baselineSubjectScale;
  const backgroundScale = clamp(0.72 + backgroundFraming * 1.9, 0.54, 3.4);
  const ratio = backgroundScale / clamp(subjectFraming, 0.25, 4);

  return {
    backgroundScale,
    ratio,
    subjectFraming,
    subjectHeight,
    subjectWidth,
  };
}

export function calculateCropPanelMetrics(state: AppState, sensorKey: SensorKey) {
  const sensor = sensors[sensorKey];
  const cropFactor = getCropFactor(sensor);
  const sceneScale = clamp((state.focalLengthMm / 50) * cropFactor * (5 / state.subjectDistanceM), 0.55, 4.2);
  const cropWidthPct = clamp((sensor.widthMm / sensors['full-frame'].widthMm) * 100, 36, 100);
  const effectiveAngleDeg = (2 * Math.atan(sensor.widthMm / (2 * state.focalLengthMm)) * 180) / Math.PI;

  return {
    cropFactor,
    cropHeightPct: cropWidthPct / 1.5,
    cropWidthPct,
    effectiveAngleDeg,
    sceneScale,
  };
}

export function calculateBokehMetrics(state: AppState, model: OpticalModel) {
  const apertureRatio = clamp((16 - state.aperture) / (16 - 1.2), 0, 1);
  const openingRadius = clamp(32 + apertureRatio * 125, 30, 162);
  const blur = clamp(
    getDefocusAmount(state.backgroundDistanceM, model) * (16 / state.aperture) * (state.focalLengthMm / 50),
    0.2,
    8.5,
  );
  const discSize = clamp(24 + blur * 18, 22, 168);

  return {
    apertureRatio,
    blur,
    discSize,
    openingRadius,
  };
}

export function calculateDistortionMetrics(focalLengthMm: number) {
  const wideStrength = clamp((35 - focalLengthMm) / 23, 0, 1);
  const teleStrength = clamp((focalLengthMm - 70) / 65, 0, 1);
  const distortionStrength = wideStrength - teleStrength * 0.28;
  const portraitScale = clamp(1 + wideStrength * 0.18 - teleStrength * 0.08, 0.9, 1.22);
  const headWide = 62 * (1 + wideStrength * 0.28);
  const headTall = 82 * (1 - wideStrength * 0.06);

  return {
    distortionStrength,
    headTall,
    headWide,
    portraitScale,
    teleStrength,
    wideStrength,
  };
}
