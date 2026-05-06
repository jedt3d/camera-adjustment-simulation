// Copyrights © 2026 by Worajedt Sitthidumrong

import { sensors, world } from './constants';
import { clamp } from './format';
import type { AppState, OpticalModel, SensorPreset } from './types';

export function getCropFactor(sensor: SensorPreset) {
  return 36 / sensor.widthMm;
}

export function calculateDof(focalLengthMm: number, focusDistanceMm: number, aperture: number, cocMm: number) {
  const hyperfocalMm = (focalLengthMm * focalLengthMm) / (aperture * cocMm) + focalLengthMm;

  if (!Number.isFinite(focusDistanceMm)) {
    return {
      hyperfocalMm,
      nearLimitMm: hyperfocalMm,
      farLimitMm: Number.POSITIVE_INFINITY,
      actualDofMm: Number.POSITIVE_INFINITY,
    };
  }

  const nearLimitMm = (hyperfocalMm * focusDistanceMm) / (hyperfocalMm + (focusDistanceMm - focalLengthMm));
  const farDenominator = hyperfocalMm - (focusDistanceMm - focalLengthMm);
  const farLimitMm = farDenominator <= 0 ? Number.POSITIVE_INFINITY : (hyperfocalMm * focusDistanceMm) / farDenominator;
  const actualDofMm = Number.isFinite(farLimitMm) ? farLimitMm - nearLimitMm : Number.POSITIVE_INFINITY;

  return {
    hyperfocalMm,
    nearLimitMm,
    farLimitMm,
    actualDofMm,
  };
}

export function calculateImageDistance(focalLengthMm: number, focusDistanceMm: number) {
  if (!Number.isFinite(focusDistanceMm)) {
    return focalLengthMm;
  }

  const discriminant = focusDistanceMm * focusDistanceMm - 4 * focalLengthMm * focusDistanceMm;

  if (discriminant <= 0) {
    return focalLengthMm;
  }

  return (focusDistanceMm - Math.sqrt(discriminant)) / 2;
}

export function buildModel(current: AppState): OpticalModel {
  const sensor = sensors[current.sensor];
  const focusDistanceMm = current.focusDistanceM * 1000;
  const focalLengthMm = current.focalLengthMm;
  const imageDistanceMm = calculateImageDistance(focalLengthMm, focusDistanceMm);
  const objectFocusDistanceMm = Number.isFinite(focusDistanceMm)
    ? Math.max(focusDistanceMm - imageDistanceMm, focalLengthMm + 1)
    : Number.POSITIVE_INFINITY;
  const optics = calculateDof(focalLengthMm, objectFocusDistanceMm, current.aperture, sensor.cocMm);
  const opticalCenterX = world.sensorX + imageDistanceMm * world.mmToPx;
  const focusX = Number.isFinite(current.focusDistanceM)
    ? world.sensorX + current.focusDistanceM * world.metersToPx
    : world.width - 70;
  const subjectX = world.sensorX + current.subjectDistanceM * world.metersToPx;
  const backgroundX = world.sensorX + current.backgroundDistanceM * world.metersToPx;
  const nearX = world.sensorX + ((optics.nearLimitMm + imageDistanceMm) / 1000) * world.metersToPx;
  const farMeters = Number.isFinite(optics.farLimitMm)
    ? (optics.farLimitMm + imageDistanceMm) / 1000
    : Math.min(current.backgroundDistanceM + 2, 20);
  const farX = world.sensorX + farMeters * world.metersToPx;
  const fovHalfAngleRad = Math.atan(sensor.widthMm / (2 * focalLengthMm));

  return {
    ...optics,
    focalLengthMm,
    imageDistanceMm,
    focusDistanceMm,
    objectFocusDistanceMm,
    aperture: current.aperture,
    focusDistanceM: current.focusDistanceM,
    subjectDistanceM: current.subjectDistanceM,
    backgroundDistanceM: current.backgroundDistanceM,
    sensorX: world.sensorX,
    mountX: world.mountX,
    opticalCenterX,
    focusX,
    subjectX,
    backgroundX,
    nearX: clamp(nearX, world.sensorX + 20, world.width - 60),
    farX: clamp(farX, world.sensorX + 30, world.width - 60),
    fovHalfAngleRad,
    sensor,
  };
}

export function getDefocusAmount(targetDistanceM: number, model: OpticalModel) {
  if (!Number.isFinite(model.focusDistanceM)) {
    return targetDistanceM >= 30 ? 0 : 1;
  }

  const dofMeters = Number.isFinite(model.actualDofMm) ? Math.max(model.actualDofMm / 1000, 0.35) : 30;

  return clamp(Math.abs(targetDistanceM - model.focusDistanceM) / dofMeters, 0, 1);
}
