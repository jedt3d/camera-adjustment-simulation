// Copyrights © 2026 by Worajedt Sitthidumrong

import { sensors } from '../core/constants';
import { getCropFactor } from '../core/optics';
import { calculateCropPanelMetrics } from '../core/pageMetrics';
import type { SensorKey } from '../core/types';
import type { PageRenderContext } from './types';

type SensorCropElements = {
  cropPanels: HTMLElement[];
};

export function renderSensorCropPage(elements: SensorCropElements, context: PageRenderContext) {
  const { renderTopicReadouts, state, t } = context;
  const fullFrameAngle = 2 * Math.atan(sensors['full-frame'].widthMm / (2 * state.focalLengthMm));

  for (const panel of elements.cropPanels) {
    const sensorKey = panel.dataset.cropPanel as SensorKey;
    const metrics = calculateCropPanelMetrics(state, sensorKey);
    panel.style.setProperty('--crop-scale', metrics.sceneScale.toFixed(3));
    panel.style.setProperty('--crop-box-width', `${metrics.cropWidthPct.toFixed(1)}%`);
    panel.style.setProperty('--crop-box-height', `${metrics.cropHeightPct.toFixed(1)}%`);
    panel.setAttribute('data-angle', `${metrics.effectiveAngleDeg.toFixed(1)} deg`);
  }

  renderTopicReadouts([
    [t('lens'), `${state.focalLengthMm} mm`],
    [t('subject'), `${state.subjectDistanceM.toFixed(1)} m`],
    [t('fullFrameFov'), `${((fullFrameAngle * 180) / Math.PI).toFixed(1)} deg`],
    ['APS-C crop', `${getCropFactor(sensors['aps-c']).toFixed(2)}x`],
    ['MFT crop', `${getCropFactor(sensors.mft).toFixed(2)}x`],
    [t('note'), t('lensStaysSame')],
  ]);
}
