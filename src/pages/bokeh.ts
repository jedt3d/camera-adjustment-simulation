// Copyrights © 2026 by Worajedt Sitthidumrong

import { clamp } from '../core/format';
import { getDefocusAmount } from '../core/optics';
import { calculateBokehMetrics } from '../core/pageMetrics';
import type { OpticalModel } from '../core/types';
import { cssPolygon, polygonPoints } from './svg';
import type { PageRenderContext, TextSetter } from './types';

type BokehElements = {
  apertureBladeLabel: SVGTextElement;
  apertureOpening: SVGPolygonElement;
  bladeGroup: SVGGElement;
  bokehField: HTMLElement;
};

export function renderBokehPage(
  elements: BokehElements,
  context: PageRenderContext,
  model: OpticalModel,
  helpers: { setText: TextSetter },
) {
  const { language, renderTopicReadouts, state, t } = context;
  const metrics = calculateBokehMetrics(state, model);
  const bladeRadius = 150;
  const polygon = cssPolygon(state.bokehBlades);

  elements.bladeGroup.innerHTML = Array.from({ length: state.bokehBlades }, (_, index) => {
    const angle = -Math.PI / 2 + index * ((Math.PI * 2) / state.bokehBlades);
    const x1 = 260 + Math.cos(angle) * metrics.openingRadius;
    const y1 = 260 + Math.sin(angle) * metrics.openingRadius;
    const x2 = 260 + Math.cos(angle + 0.42) * bladeRadius;
    const y2 = 260 + Math.sin(angle + 0.42) * bladeRadius;
    const x3 = 260 + Math.cos(angle + 0.92) * bladeRadius;
    const y3 = 260 + Math.sin(angle + 0.92) * bladeRadius;
    return `<path class="aperture-blade" d="M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} Q 260 260 ${x3.toFixed(1)} ${y3.toFixed(1)} Z"></path>`;
  }).join('');
  elements.apertureOpening.setAttribute('points', polygonPoints(260, 260, metrics.openingRadius, state.bokehBlades));
  helpers.setText(
    elements.apertureBladeLabel,
    260,
    470,
    `${state.bokehBlades} blades at f/${state.aperture.toFixed(1)}`,
  );
  elements.bokehField.style.setProperty('--bokeh-demo-size', `${metrics.discSize.toFixed(1)}px`);
  elements.bokehField.style.setProperty('--bokeh-demo-shape', polygon);
  elements.bokehField.style.setProperty('--bokeh-demo-blur', `${clamp(metrics.blur * 1.1, 0.5, 10).toFixed(1)}px`);

  renderTopicReadouts([
    [t('aperture'), `f/${state.aperture.toFixed(1)}`],
    [t('focalLength'), `${state.focalLengthMm} mm`],
    [t('blades'), `${state.bokehBlades}`],
    [t('highlightSize'), `${metrics.discSize.toFixed(0)} px`],
    [t('backgroundDefocus'), `${(getDefocusAmount(state.backgroundDistanceM, model) * 100).toFixed(0)}%`],
    [
      t('shape'),
      state.aperture <= 2.8
        ? language === 'th'
          ? 'กลมกว่า'
          : 'Rounder'
        : language === 'th'
          ? 'เหลี่ยมกว่า'
          : 'Polygonal',
    ],
  ]);
}
