// Copyrights © 2026 by Worajedt Sitthidumrong

import { describe, expect, it } from 'vitest';
import { clamp, formatDof, formatFocusDistance, formatMeters, formatShutter } from './format';

describe('format helpers', () => {
  it('clamps values into an inclusive range', () => {
    expect(clamp(-2, 0, 10)).toBe(0);
    expect(clamp(6, 0, 10)).toBe(6);
    expect(clamp(22, 0, 10)).toBe(10);
  });

  it('formats depth of field with mm, cm, m, and infinity units', () => {
    expect(formatDof(4.4)).toBe('4.4 mm');
    expect(formatDof(450)).toBe('45 cm');
    expect(formatDof(1250)).toBe('1.25 m');
    expect(formatDof(Number.POSITIVE_INFINITY)).toBe('∞');
  });

  it('formats distances and shutter speeds for camera readouts', () => {
    expect(formatMeters(5234)).toBe('5.23 m');
    expect(formatFocusDistance(Number.POSITIVE_INFINITY)).toBe('∞');
    expect(formatShutter(1 / 125)).toBe('1/125');
    expect(formatShutter(2)).toBe('2s');
  });
});
