// Copyrights © 2026 by Worajedt Sitthidumrong

import { clamp, formatShutter } from '../core/format';
import { calculateExposureMetrics } from '../core/pageMetrics';
import type { LineSetter, PageRenderContext, TextSetter } from './types';

type ExposureElements = {
  apertureNodeValue: SVGTextElement;
  exposureBalanceLine: SVGLineElement;
  exposureCenterValue: SVGTextElement;
  exposureGrain: HTMLElement;
  exposureMotionTrail: HTMLElement;
  exposurePreview: HTMLElement;
  isoNodeValue: SVGTextElement;
  shutterNodeValue: SVGTextElement;
};

export function renderExposurePage(
  elements: ExposureElements,
  context: PageRenderContext,
  helpers: { setLine: LineSetter; setText: TextSetter },
) {
  const { renderTopicReadouts, state, t } = context;
  const metrics = calculateExposureMetrics(state);

  elements.exposurePreview.style.setProperty('--exposure-brightness', metrics.previewBrightness.toFixed(3));
  elements.exposurePreview.style.setProperty('--motion-blur', `${metrics.motionBlur.toFixed(1)}px`);
  elements.exposureGrain.style.opacity = metrics.grainOpacity.toFixed(3);
  elements.exposureMotionTrail.style.opacity = clamp(metrics.motionBlur / 28, 0, 0.72).toFixed(3);
  helpers.setLine(elements.exposureBalanceLine, 320, 220, metrics.balanceX, 220);
  helpers.setText(elements.apertureNodeValue, 320, 76, `f/${state.aperture.toFixed(1)}`);
  helpers.setText(elements.shutterNodeValue, 88, 378, formatShutter(state.shutterSpeedS));
  helpers.setText(elements.isoNodeValue, 552, 378, `${state.iso}`);
  helpers.setText(
    elements.exposureCenterValue,
    320,
    222,
    `${metrics.stopDelta >= 0 ? '+' : ''}${metrics.stopDelta.toFixed(1)} EV`,
  );

  renderTopicReadouts([
    [t('aperture'), `f/${state.aperture.toFixed(1)}`],
    [t('shutter'), formatShutter(state.shutterSpeedS)],
    [t('iso'), state.iso.toString()],
    [t('evAtIso100'), metrics.ev100.toFixed(1)],
    [t('exposureBias'), `${metrics.stopDelta >= 0 ? '+' : ''}${metrics.stopDelta.toFixed(1)} stops`],
    [t('motionBlur'), `${metrics.motionBlur.toFixed(0)} px`],
  ]);
}
