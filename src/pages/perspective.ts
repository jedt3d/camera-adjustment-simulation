// Copyrights © 2026 by Worajedt Sitthidumrong

import { calculatePerspectiveMetrics } from '../core/pageMetrics';
import type { LineSetter, PageRenderContext, TextSetter } from './types';

type PerspectiveElements = {
  perspectiveBackground: SVGGElement;
  perspectiveGrid: SVGGElement;
  perspectiveLabel: SVGTextElement;
  perspectiveScaleLabel: SVGTextElement;
  perspectiveSubject: SVGGElement;
  perspectiveSubjectGuide: SVGLineElement;
};

export function renderPerspectivePage(
  elements: PerspectiveElements,
  context: PageRenderContext,
  helpers: { setLine: LineSetter; setText: TextSetter },
) {
  const { renderTopicReadouts, state, t } = context;
  const metrics = calculatePerspectiveMetrics(state);
  const subjectX = 410;
  const groundY = 525;
  const bgCenterX = 820;
  const skylineBaseY = 438;
  const bgWidth = 220 * metrics.backgroundScale;
  const bgHeight = 190 * metrics.backgroundScale;
  const guideTop = groundY - metrics.subjectHeight;

  elements.perspectiveGrid.innerHTML = Array.from({ length: 9 }, (_, index) => {
    const y = 520 - index * 46;
    return `<line class="perspective-grid-line" x1="${100 + index * 22}" y1="${y}" x2="${1180 - index * 22}" y2="${y}"></line>`;
  }).join('');

  elements.perspectiveBackground.innerHTML = `
    <rect class="perspective-building perspective-building--main" x="${(bgCenterX - bgWidth / 2).toFixed(1)}" y="${(skylineBaseY - bgHeight).toFixed(1)}" width="${bgWidth.toFixed(1)}" height="${bgHeight.toFixed(1)}"></rect>
    <rect class="perspective-building" x="${(bgCenterX - bgWidth * 0.82).toFixed(1)}" y="${(skylineBaseY - bgHeight * 0.68).toFixed(1)}" width="${(bgWidth * 0.34).toFixed(1)}" height="${(bgHeight * 0.68).toFixed(1)}"></rect>
    <rect class="perspective-building" x="${(bgCenterX + bgWidth * 0.5).toFixed(1)}" y="${(skylineBaseY - bgHeight * 0.82).toFixed(1)}" width="${(bgWidth * 0.3).toFixed(1)}" height="${(bgHeight * 0.82).toFixed(1)}"></rect>
  `;
  elements.perspectiveSubject.innerHTML = `
    <ellipse class="perspective-shadow" cx="${subjectX}" cy="${groundY + 6}" rx="${(metrics.subjectWidth * 0.75).toFixed(1)}" ry="12"></ellipse>
    <circle class="perspective-head" cx="${subjectX}" cy="${(guideTop + metrics.subjectHeight * 0.14).toFixed(1)}" r="${(metrics.subjectWidth * 0.38).toFixed(1)}"></circle>
    <path class="perspective-body" d="M ${(subjectX - metrics.subjectWidth / 2).toFixed(1)} ${(guideTop + metrics.subjectHeight * 0.28).toFixed(1)} Q ${subjectX} ${(guideTop + metrics.subjectHeight * 0.22).toFixed(1)} ${(subjectX + metrics.subjectWidth / 2).toFixed(1)} ${(guideTop + metrics.subjectHeight * 0.28).toFixed(1)} L ${(subjectX + metrics.subjectWidth * 0.42).toFixed(1)} ${groundY} H ${(subjectX - metrics.subjectWidth * 0.42).toFixed(1)} Z"></path>
  `;
  helpers.setLine(
    elements.perspectiveSubjectGuide,
    subjectX + metrics.subjectWidth / 2 + 18,
    guideTop,
    subjectX + metrics.subjectWidth / 2 + 18,
    groundY,
  );
  helpers.setText(
    elements.perspectiveLabel,
    640,
    70,
    `${state.focalLengthMm}mm from ${state.subjectDistanceM.toFixed(1)} m`,
  );
  helpers.setText(
    elements.perspectiveScaleLabel,
    640,
    554,
    `Background appears ${metrics.ratio.toFixed(2)}x relative to the subject compared with this framing.`,
  );

  renderTopicReadouts([
    [t('focalLength'), `${state.focalLengthMm} mm`],
    [t('cameraDistance'), `${state.subjectDistanceM.toFixed(1)} m`],
    [t('background'), `${state.backgroundDistanceM.toFixed(1)} m`],
    [t('subjectHeight'), `${Math.round(metrics.subjectHeight)} px`],
    [t('backgroundScale'), `${metrics.backgroundScale.toFixed(2)}x`],
    [t('compression'), `${metrics.ratio.toFixed(2)}x`],
  ]);
}
