// Copyrights © 2026 by Worajedt Sitthidumrong

import { calculateDistortionMetrics } from '../core/pageMetrics';
import type { PageRenderContext, TextSetter } from './types';

type LensDistortionElements = {
  distortionAmountLabel: SVGTextElement;
  distortionGrid: SVGGElement;
  distortionLabel: SVGTextElement;
  distortionPortrait: SVGGElement;
};

function distortedX(x: number, center: number, strength: number) {
  const normalized = (x - center) / 260;
  return x + normalized * normalized * normalized * strength * 86;
}

export function renderLensDistortionPage(
  elements: LensDistortionElements,
  context: PageRenderContext,
  helpers: { setText: TextSetter },
) {
  const { language, renderTopicReadouts, state, t } = context;
  const metrics = calculateDistortionMetrics(state.focalLengthMm);
  const centerLeft = 320;
  const centerRight = 960;
  const top = 112;
  const bottom = 514;
  const leftMin = 112;
  const leftMax = 528;
  const rightMin = 752;
  const rightMax = 1168;
  const gridLines: string[] = [];

  for (let i = 0; i <= 8; i += 1) {
    const x = leftMin + i * ((leftMax - leftMin) / 8);
    gridLines.push(`<line class="distortion-grid-line" x1="${x}" y1="${top}" x2="${x}" y2="${bottom}"></line>`);
    const rx = rightMin + i * ((rightMax - rightMin) / 8);
    const warped = distortedX(rx, centerRight, metrics.distortionStrength);
    gridLines.push(
      `<path class="distortion-grid-line distortion-grid-line--warped" d="M ${warped.toFixed(1)} ${top} Q ${(rx - metrics.distortionStrength * (rx - centerRight) * 0.22).toFixed(1)} 313 ${warped.toFixed(1)} ${bottom}"></path>`,
    );
  }

  for (let i = 0; i <= 6; i += 1) {
    const y = top + i * ((bottom - top) / 6);
    gridLines.push(`<line class="distortion-grid-line" x1="${leftMin}" y1="${y}" x2="${leftMax}" y2="${y}"></line>`);
    gridLines.push(
      `<path class="distortion-grid-line distortion-grid-line--warped" d="M ${rightMin} ${y} Q ${centerRight} ${(y + metrics.distortionStrength * (y - 313) * 0.36).toFixed(1)} ${rightMax} ${y}"></path>`,
    );
  }

  elements.distortionGrid.innerHTML = gridLines.join('');
  elements.distortionPortrait.innerHTML = `
    <g class="portrait-reference">
      <ellipse class="portrait-head" cx="${centerLeft}" cy="254" rx="48" ry="66"></ellipse>
      <path class="portrait-shoulders" d="M 220 442 Q ${centerLeft} 358 420 442 Z"></path>
    </g>
    <g class="portrait-warped" transform="translate(${centerRight} 0) scale(${metrics.portraitScale.toFixed(3)} 1) translate(${-centerRight} 0)">
      <ellipse class="portrait-head" cx="${centerRight}" cy="254" rx="${metrics.headWide.toFixed(1)}" ry="${metrics.headTall.toFixed(1)}"></ellipse>
      <path class="portrait-shoulders" d="M ${(centerRight - 110 - metrics.wideStrength * 28).toFixed(1)} 442 Q ${centerRight} ${(358 - metrics.wideStrength * 16).toFixed(1)} ${(centerRight + 110 + metrics.wideStrength * 28).toFixed(1)} 442 Z"></path>
    </g>
  `;
  helpers.setText(
    elements.distortionLabel,
    960,
    72,
    state.focalLengthMm <= 28
      ? 'Wide-angle barrel emphasis'
      : state.focalLengthMm >= 85
        ? 'Telephoto flattening'
        : 'Near-neutral rendering',
  );
  helpers.setText(
    elements.distortionAmountLabel,
    640,
    586,
    `${state.focalLengthMm}mm: illustrative distortion strength ${Math.abs(metrics.distortionStrength).toFixed(2)}`,
  );

  renderTopicReadouts([
    [t('focalLength'), `${state.focalLengthMm} mm`],
    [
      t('rendering'),
      state.focalLengthMm <= 28
        ? t('wide')
        : state.focalLengthMm >= 85
          ? t('tele')
          : language === 'th'
            ? 'ใกล้เคียงปกติ'
            : 'Neutral',
    ],
    [t('wideEmphasis'), `${(metrics.wideStrength * 100).toFixed(0)}%`],
    [t('teleFlattening'), `${(metrics.teleStrength * 100).toFixed(0)}%`],
    [t('subjectDistance'), `${state.subjectDistanceM.toFixed(1)} m`],
    [t('model'), language === 'th' ? 'เพื่ออธิบายแนวคิด' : 'Illustrative'],
  ]);
}
