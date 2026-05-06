// Copyrights © 2026 by Worajedt Sitthidumrong

import { focalSteps, world } from '../core/constants';
import { clamp, formatDof, formatFocusDistance, formatMeters } from '../core/format';
import type { AppState, OpticalModel } from '../core/types';
import type { LineSetter, TextSetter, Translate } from './types';

export type DepthElements = {
  actualDofReadout: HTMLElement;
  apertureValue: HTMLOutputElement;
  backgroundLabel: SVGTextElement;
  backgroundPlane: SVGLineElement;
  backgroundValue: HTMLOutputElement;
  cameraBody: SVGPathElement;
  cameraLabel: SVGTextElement;
  cameraToSubject: SVGLineElement;
  cameraToSubjectLabel: SVGTextElement;
  dofBand: SVGRectElement;
  farLabel: SVGTextElement;
  farPlane: SVGLineElement;
  farReadout: HTMLElement;
  focusCenter: SVGLineElement;
  focalLengthValue: HTMLOutputElement;
  focalReadout: HTMLElement;
  focusPlane: SVGLineElement;
  focusPlaneLabel: SVGTextElement;
  focusPointLabel: SVGTextElement;
  focusReadout: HTMLElement;
  focusValue: HTMLOutputElement;
  fovFill: SVGPolygonElement;
  fovLabel: SVGTextElement;
  grid: SVGGElement;
  hyperfocalReadout: HTMLElement;
  imageRayLower: SVGPolylineElement;
  imageRayUpper: SVGPolylineElement;
  lens: SVGPathElement;
  lensFrontPlane: SVGLineElement;
  lowerRay: SVGLineElement;
  nearLabel: SVGTextElement;
  nearPlane: SVGLineElement;
  nearReadout: HTMLElement;
  nodalPoint: SVGCircleElement;
  sensorLabel: SVGTextElement;
  sensorPlane: SVGLineElement;
  sensorSizeLabel: SVGTextElement;
  sensorToLens: SVGLineElement;
  sensorToLensLabel: SVGTextElement;
  subjectDistanceValue: HTMLOutputElement;
  subjectHead: SVGEllipseElement;
  subjectShoulders: SVGPathElement;
  subjectToBackground: SVGLineElement;
  subjectToBackgroundLabel: SVGTextElement;
  subjectTorso: SVGPathElement;
  upperRay: SVGLineElement;
};

type DepthHelpers = {
  setLine: LineSetter;
  setText: TextSetter;
  t: Translate;
};

type DepthLayout = {
  axisY: number;
  backgroundHalf: number;
  bodyBottomY: number;
  bodyLeftX: number;
  bodyRightX: number;
  bodyTopY: number;
  flangeToFrontMm: number;
  focusBottomY: number;
  focusRayX: number;
  focusTopY: number;
  fovBottomY: number;
  fovEndX: number;
  fovTopY: number;
  lensBackX: number;
  lensCurve: number;
  lensDistanceY: number;
  lensFrontBaseX: number;
  lensFrontSurfaceX: number;
  lensHalf: number;
  opticalCenterX: number;
  sensorBottomY: number;
  sensorTopY: number;
  sensorX: number;
};

function setSubjectShape(elements: DepthElements, x: number, y: number, height: number) {
  const clampedHeight = clamp(height, 70, 210);
  const headRy = clampedHeight * 0.16;
  const headRx = clampedHeight * 0.09;
  const shoulderHalf = clampedHeight * 0.24;
  const torsoHalf = clampedHeight * 0.16;
  const topY = y - clampedHeight / 2;
  const shoulderY = y - clampedHeight * 0.08;
  const hipY = y + clampedHeight * 0.35;

  elements.subjectHead.setAttribute('cx', x.toFixed(2));
  elements.subjectHead.setAttribute('cy', (topY + headRy).toFixed(2));
  elements.subjectHead.setAttribute('rx', headRx.toFixed(2));
  elements.subjectHead.setAttribute('ry', headRy.toFixed(2));
  elements.subjectShoulders.setAttribute(
    'd',
    `M ${x.toFixed(2)} ${(topY + headRy * 2.15).toFixed(2)} C ${(x - shoulderHalf).toFixed(2)} ${(shoulderY - 8).toFixed(2)}, ${(x - shoulderHalf).toFixed(2)} ${(shoulderY + 18).toFixed(2)}, ${(x - torsoHalf).toFixed(2)} ${shoulderY.toFixed(2)} C ${(x - 6).toFixed(2)} ${(shoulderY + 10).toFixed(2)}, ${(x + 6).toFixed(2)} ${(shoulderY + 10).toFixed(2)}, ${(x + torsoHalf).toFixed(2)} ${shoulderY.toFixed(2)} C ${(x + shoulderHalf).toFixed(2)} ${(shoulderY + 18).toFixed(2)}, ${(x + shoulderHalf).toFixed(2)} ${(shoulderY - 8).toFixed(2)}, ${x.toFixed(2)} ${(topY + headRy * 2.15).toFixed(2)} Z`,
  );
  elements.subjectTorso.setAttribute(
    'd',
    `M ${(x - torsoHalf).toFixed(2)} ${shoulderY.toFixed(2)} C ${(x - torsoHalf * 0.85).toFixed(2)} ${(y + 10).toFixed(2)}, ${(x - torsoHalf * 0.5).toFixed(2)} ${hipY.toFixed(2)}, ${x.toFixed(2)} ${hipY.toFixed(2)} C ${(x + torsoHalf * 0.5).toFixed(2)} ${hipY.toFixed(2)}, ${(x + torsoHalf * 0.85).toFixed(2)} ${(y + 10).toFixed(2)}, ${(x + torsoHalf).toFixed(2)} ${shoulderY.toFixed(2)} Z`,
  );
}

export function renderDepthGrid(elements: Pick<DepthElements, 'grid'>) {
  const lines: string[] = [];
  const gridEndX = world.sensorX + 20 * world.metersToPx;

  for (let x = world.sensorX; x <= gridEndX; x += world.metersToPx) {
    const meters = Math.round((x - world.sensorX) / world.metersToPx);
    lines.push(`<line class="grid-line" x1="${x}" y1="70" x2="${x}" y2="528"></line>`);
    lines.push(`<text class="grid-label" x="${x + 4}" y="88">${meters}m</text>`);
  }

  for (let y = 124; y <= 492; y += 46) {
    lines.push(`<line class="grid-line grid-line--horizontal" x1="70" y1="${y}" x2="${gridEndX}" y2="${y}"></line>`);
  }

  elements.grid.innerHTML = lines.join('');
}

function calculateDepthLayout(model: OpticalModel): DepthLayout {
  const axisY = world.axisY;
  const opticalCenterX = model.opticalCenterX;
  const sensorX = model.sensorX;
  const mountX = model.mountX;
  const sensorHalf = model.sensor.widthMm * 1.45;
  const focalT = (model.focalLengthMm - focalSteps[0]) / (focalSteps[focalSteps.length - 1] - focalSteps[0]);
  const lensLength = 50 + focalT * 150;
  const lensCurve = 32 - focalT * 13;
  const lensBackX = mountX;
  const lensFrontBaseX = mountX + lensLength;
  const lensFrontSurfaceX = lensFrontBaseX + lensCurve * 0.38;
  const lensHalf = 88 - focalT * 18;
  const bodyLeftX = 50;
  const bodyRightX = bodyLeftX + 90;
  const bodyTopY = axisY - 106.99875;
  const bodyBottomY = axisY + 106.99875;
  const focusRayHalf = Number.isFinite(model.focusDistanceM)
    ? clamp(Math.tan(model.fovHalfAngleRad) * (model.focusX - opticalCenterX), 40, 270)
    : 270;
  const backgroundHalf = clamp(Math.tan(model.fovHalfAngleRad) * (model.backgroundX - opticalCenterX), 42, 250);
  const fovEndX = Math.min(world.fovReach, world.width - 70);
  const fovHalfHeight = Math.tan(model.fovHalfAngleRad) * (fovEndX - opticalCenterX);
  const fovTopY = clamp(axisY - fovHalfHeight, 54, world.height - 54);
  const fovBottomY = clamp(axisY + fovHalfHeight, 54, world.height - 54);
  const focusRayX = Number.isFinite(model.focusDistanceM) ? Math.min(model.focusX, fovEndX) : fovEndX;
  const focusTopY = axisY - focusRayHalf;
  const focusBottomY = axisY + focusRayHalf;
  const sensorTopY = axisY - sensorHalf;
  const sensorBottomY = axisY + sensorHalf;
  const lensDistanceY = axisY + lensHalf + 30;
  const flangeToFrontMm = 18 + lensLength / world.mmToPx;

  return {
    axisY,
    backgroundHalf,
    bodyBottomY,
    bodyLeftX,
    bodyRightX,
    bodyTopY,
    flangeToFrontMm,
    focusBottomY,
    focusRayX,
    focusTopY,
    fovBottomY,
    fovEndX,
    fovTopY,
    lensBackX,
    lensCurve,
    lensDistanceY,
    lensFrontBaseX,
    lensFrontSurfaceX,
    lensHalf,
    opticalCenterX,
    sensorBottomY,
    sensorTopY,
    sensorX,
  };
}

function renderDepthGeometry(elements: DepthElements, model: OpticalModel, layout: DepthLayout, helpers: DepthHelpers) {
  const { setLine } = helpers;

  elements.dofBand.setAttribute('x', Math.min(model.nearX, model.farX).toFixed(2));
  elements.dofBand.setAttribute('width', Math.max(Math.abs(model.farX - model.nearX), 4).toFixed(2));
  elements.fovFill.setAttribute(
    'points',
    `${layout.opticalCenterX},${layout.axisY} ${layout.fovEndX},${layout.fovTopY} ${layout.fovEndX},${layout.fovBottomY}`,
  );

  setLine(elements.upperRay, layout.opticalCenterX, layout.axisY, layout.fovEndX, layout.fovTopY);
  setLine(elements.lowerRay, layout.opticalCenterX, layout.axisY, layout.fovEndX, layout.fovBottomY);
  setLine(elements.focusCenter, layout.sensorX, layout.axisY, layout.focusRayX, layout.axisY);
  setLine(elements.nearPlane, model.nearX, 126, model.nearX, 490);
  setLine(elements.farPlane, model.farX, 126, model.farX, 490);
  setLine(elements.focusPlane, layout.focusRayX, 126, layout.focusRayX, 490);
  setSubjectShape(elements, model.subjectX, layout.axisY, 96);
  setLine(
    elements.backgroundPlane,
    model.backgroundX,
    layout.axisY - layout.backgroundHalf,
    model.backgroundX,
    layout.axisY + layout.backgroundHalf,
  );
  setLine(elements.cameraToSubject, layout.sensorX, 542, model.subjectX, 542);
  setLine(elements.subjectToBackground, model.subjectX, 574, model.backgroundX, 574);
  setLine(elements.sensorPlane, layout.sensorX, layout.sensorTopY, layout.sensorX, layout.sensorBottomY);
  setLine(
    elements.lensFrontPlane,
    layout.lensFrontSurfaceX,
    layout.axisY - layout.lensHalf,
    layout.lensFrontSurfaceX,
    layout.axisY + layout.lensHalf,
  );
  setLine(elements.sensorToLens, layout.sensorX, layout.lensDistanceY, layout.lensFrontSurfaceX, layout.lensDistanceY);

  elements.imageRayUpper.setAttribute(
    'points',
    `${layout.focusRayX.toFixed(2)},${layout.focusTopY.toFixed(2)} ${layout.opticalCenterX.toFixed(2)},${layout.axisY.toFixed(2)} ${layout.sensorX.toFixed(2)},${layout.sensorBottomY.toFixed(2)}`,
  );
  elements.imageRayLower.setAttribute(
    'points',
    `${layout.focusRayX.toFixed(2)},${layout.focusBottomY.toFixed(2)} ${layout.opticalCenterX.toFixed(2)},${layout.axisY.toFixed(2)} ${layout.sensorX.toFixed(2)},${layout.sensorTopY.toFixed(2)}`,
  );
}

function renderDepthCamera(elements: DepthElements, layout: DepthLayout) {
  elements.cameraBody.setAttribute(
    'd',
    `M ${layout.bodyLeftX} ${layout.bodyTopY} H ${layout.bodyRightX - 18} q 18 0 18 18 V ${layout.bodyBottomY - 18} q 0 18 -18 18 H ${layout.bodyLeftX} q -18 0 -18 -18 V ${layout.bodyTopY + 18} q 0 -18 18 -18 z`,
  );
  elements.lens.setAttribute(
    'd',
    `M ${layout.lensBackX} ${layout.axisY - layout.lensHalf} H ${layout.lensFrontBaseX} C ${layout.lensFrontBaseX + layout.lensCurve} ${layout.axisY - layout.lensHalf * 0.58}, ${layout.lensFrontBaseX + layout.lensCurve} ${layout.axisY + layout.lensHalf * 0.58}, ${layout.lensFrontBaseX} ${layout.axisY + layout.lensHalf} H ${layout.lensBackX} Z`,
  );
  elements.nodalPoint.setAttribute('cx', layout.opticalCenterX.toFixed(2));
  elements.nodalPoint.setAttribute('cy', layout.axisY.toFixed(2));
}

function renderDepthLabels(elements: DepthElements, model: OpticalModel, layout: DepthLayout, helpers: DepthHelpers) {
  const { setText, t } = helpers;

  setText(elements.cameraLabel, layout.bodyLeftX + 10, layout.bodyTopY - 12, t('cameraCutaway'));
  setText(elements.nearLabel, model.nearX - 38, 510, t('nearLimit'));
  setText(
    elements.focusPlaneLabel,
    layout.focusRayX - 56,
    116,
    `${t('focus')} ${formatFocusDistance(model.focusDistanceM)}`,
  );
  setText(elements.farLabel, model.farX - 28, 510, t('farLimit'));
  setText(elements.backgroundLabel, model.backgroundX - 44, layout.axisY - layout.backgroundHalf - 16, t('background'));
  setText(elements.fovLabel, layout.fovEndX - 112, layout.fovTopY + 20, t('fieldOfView'));
  setText(elements.sensorLabel, layout.sensorX - 42, layout.sensorTopY - 18, `${model.sensor.label} ${t('sensor')}`);
  setText(
    elements.sensorSizeLabel,
    layout.sensorX - 38,
    layout.sensorBottomY + 26,
    `${model.sensor.widthMm.toFixed(1)} mm wide`,
  );
  setText(elements.focusPointLabel, layout.opticalCenterX + 12, layout.axisY - 16, 'Optical center');
  setText(
    elements.sensorToLensLabel,
    (layout.sensorX + layout.lensFrontSurfaceX) / 2 - 54,
    layout.lensDistanceY + 22,
    `${t('sensorToLensFront')}: ${layout.flangeToFrontMm.toFixed(0)} mm`,
  );
  setText(
    elements.cameraToSubjectLabel,
    (layout.sensorX + model.subjectX) / 2 - 54,
    532,
    `${t('sensorToSubject')}: ${model.subjectDistanceM.toFixed(1)} m`,
  );
  setText(
    elements.subjectToBackgroundLabel,
    (model.subjectX + model.backgroundX) / 2 - 64,
    600,
    `${t('subjectToBackground')}: ${(model.backgroundDistanceM - model.subjectDistanceM).toFixed(1)} m`,
  );
}

function renderDepthReadouts(elements: DepthElements, model: OpticalModel, state: AppState) {
  elements.apertureValue.textContent = `f/${state.aperture.toFixed(1)}`;
  elements.focusValue.textContent = formatFocusDistance(state.focusDistanceM);
  elements.subjectDistanceValue.textContent = `${state.subjectDistanceM.toFixed(1)} m`;
  elements.backgroundValue.textContent = `${state.backgroundDistanceM.toFixed(1)} m`;
  elements.focalLengthValue.textContent = `${Math.round(state.focalLengthMm)} mm`;
  elements.focalReadout.textContent = `${model.focalLengthMm.toFixed(1)} mm`;
  elements.focusReadout.textContent = formatFocusDistance(model.focusDistanceM);
  elements.actualDofReadout.textContent = formatDof(model.actualDofMm);
  elements.nearReadout.textContent = formatMeters(model.nearLimitMm + model.imageDistanceMm);
  elements.farReadout.textContent = Number.isFinite(model.farLimitMm)
    ? formatMeters(model.farLimitMm + model.imageDistanceMm)
    : '∞';
  elements.hyperfocalReadout.textContent = formatMeters(model.hyperfocalMm + model.imageDistanceMm);
}

export function renderDepthPage(elements: DepthElements, model: OpticalModel, state: AppState, helpers: DepthHelpers) {
  const layout = calculateDepthLayout(model);

  renderDepthGeometry(elements, model, layout, helpers);
  renderDepthCamera(elements, layout);
  renderDepthLabels(elements, model, layout, helpers);
  renderDepthReadouts(elements, model, state);
}
