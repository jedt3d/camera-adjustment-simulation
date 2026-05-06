// Copyrights © 2026 by Worajedt Sitthidumrong

import { describe, expect, it } from 'vitest';
import { defaultState } from './constants';
import {
  calculateBokehMetrics,
  calculateCropPanelMetrics,
  calculateDistortionMetrics,
  calculateExposureMetrics,
  calculatePerspectiveMetrics,
} from './pageMetrics';
import { buildModel } from './optics';

describe('page metric helpers', () => {
  it('keeps default exposure near the baseline', () => {
    const metrics = calculateExposureMetrics(defaultState);

    expect(metrics.stopDelta).toBeCloseTo(0, 3);
    expect(metrics.previewBrightness).toBeCloseTo(0.58, 3);
    expect(metrics.motionBlur).toBe(0);
  });

  it('computes perspective subject and background scales', () => {
    const metrics = calculatePerspectiveMetrics(defaultState);

    expect(metrics.subjectHeight).toBeCloseTo(230, 1);
    expect(metrics.backgroundScale).toBeGreaterThan(1);
    expect(metrics.ratio).toBeGreaterThan(1);
  });

  it('computes tighter crop metrics for smaller sensors', () => {
    const fullFrame = calculateCropPanelMetrics(defaultState, 'full-frame');
    const mft = calculateCropPanelMetrics(defaultState, 'mft');

    expect(fullFrame.cropWidthPct).toBe(100);
    expect(mft.cropWidthPct).toBeLessThan(fullFrame.cropWidthPct);
    expect(mft.sceneScale).toBeGreaterThan(fullFrame.sceneScale);
  });

  it('computes bokeh disc size from defocus and aperture', () => {
    const model = buildModel(defaultState);
    const metrics = calculateBokehMetrics(defaultState, model);

    expect(metrics.openingRadius).toBeGreaterThan(120);
    expect(metrics.discSize).toBeGreaterThan(50);
  });

  it('separates wide-angle and telephoto distortion behavior', () => {
    const wide = calculateDistortionMetrics(24);
    const tele = calculateDistortionMetrics(135);

    expect(wide.wideStrength).toBeGreaterThan(0);
    expect(wide.distortionStrength).toBeGreaterThan(0);
    expect(tele.teleStrength).toBeGreaterThan(0);
    expect(tele.distortionStrength).toBeLessThan(0);
  });
});
