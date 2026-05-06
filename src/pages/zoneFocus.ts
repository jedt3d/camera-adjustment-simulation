// Copyrights © 2026 by Worajedt Sitthidumrong

import { clamp, formatFocusDistance, formatMeters } from '../core/format';
import type { OpticalModel } from '../core/types';
import type { LineSetter, PageRenderContext, TextSetter } from './types';

type ZoneFocusElements = {
  zoneBand: SVGRectElement;
  zoneFarLine: SVGLineElement;
  zoneFocusLine: SVGLineElement;
  zoneGrid: SVGGElement;
  zoneNearLine: SVGLineElement;
  zoneScaleLabel: SVGTextElement;
  zoneStatusLabel: SVGTextElement;
  zoneSubjectMarker: SVGGElement;
};

export function renderZoneFocusPage(
  elements: ZoneFocusElements,
  context: PageRenderContext,
  model: OpticalModel,
  helpers: { setLine: LineSetter; setText: TextSetter },
) {
  const { renderTopicReadouts, state, t } = context;
  const leftX = 90;
  const rightX = 1190;
  const groundTop = 118;
  const groundBottom = 520;
  const pxPerMeter = (rightX - leftX) / 20;
  const toX = (meters: number) => leftX + clamp(meters, 0, 20) * pxPerMeter;
  const nearMeters = (model.nearLimitMm + model.imageDistanceMm) / 1000;
  const focusMeters = Number.isFinite(model.focusDistanceM) ? model.focusDistanceM : 20;
  const farMeters = Number.isFinite(model.farLimitMm) ? (model.farLimitMm + model.imageDistanceMm) / 1000 : 20;
  const subjectInside =
    state.subjectDistanceM >= nearMeters && (!Number.isFinite(model.farLimitMm) || state.subjectDistanceM <= farMeters);
  const nearX = toX(nearMeters);
  const focusX = toX(focusMeters);
  const farX = toX(farMeters);
  const subjectX = toX(state.subjectDistanceM);

  elements.zoneGrid.innerHTML = Array.from({ length: 21 }, (_, meters) => {
    const x = toX(meters);
    return `<line class="zone-grid-line" x1="${x}" y1="${groundTop}" x2="${x}" y2="${groundBottom}"></line><text class="zone-grid-label" x="${x + 4}" y="${groundBottom + 24}">${meters}m</text>`;
  }).join('');
  elements.zoneBand.setAttribute('x', nearX.toFixed(2));
  elements.zoneBand.setAttribute('y', groundTop.toString());
  elements.zoneBand.setAttribute('width', Math.max(farX - nearX, 4).toFixed(2));
  elements.zoneBand.setAttribute('height', (groundBottom - groundTop).toString());
  helpers.setLine(elements.zoneNearLine, nearX, groundTop, nearX, groundBottom);
  helpers.setLine(elements.zoneFocusLine, focusX, groundTop, focusX, groundBottom);
  helpers.setLine(elements.zoneFarLine, farX, groundTop, farX, groundBottom);
  elements.zoneSubjectMarker.innerHTML = `
    <circle class="${subjectInside ? 'zone-subject zone-subject--inside' : 'zone-subject'}" cx="${subjectX.toFixed(1)}" cy="300" r="22"></circle>
    <path class="zone-subject-body" d="M ${(subjectX - 34).toFixed(1)} 342 Q ${subjectX.toFixed(1)} 318 ${(subjectX + 34).toFixed(1)} 342 L ${(subjectX + 24).toFixed(1)} 396 H ${(subjectX - 24).toFixed(1)} Z"></path>
    <text class="topic-svg-label" x="${subjectX.toFixed(1)}" y="436">${t('subject')}</text>
  `;
  helpers.setText(
    elements.zoneStatusLabel,
    640,
    84,
    subjectInside ? 'Subject is inside the focus zone' : 'Subject is outside the focus zone',
  );
  helpers.setText(
    elements.zoneScaleLabel,
    640,
    548,
    `Near ${formatMeters(model.nearLimitMm + model.imageDistanceMm)} / Focus ${formatFocusDistance(model.focusDistanceM)} / Far ${Number.isFinite(model.farLimitMm) ? formatMeters(model.farLimitMm + model.imageDistanceMm) : '∞'}`,
  );

  renderTopicReadouts([
    [t('nearLimit'), formatMeters(model.nearLimitMm + model.imageDistanceMm)],
    [t('focus'), formatFocusDistance(model.focusDistanceM)],
    [t('farLimit'), Number.isFinite(model.farLimitMm) ? formatMeters(model.farLimitMm + model.imageDistanceMm) : '∞'],
    [t('hyperfocal'), formatMeters(model.hyperfocalMm + model.imageDistanceMm)],
    [t('subject'), `${state.subjectDistanceM.toFixed(1)} m`],
    [t('status'), subjectInside ? t('sharpZone') : t('soft')],
  ]);
}
