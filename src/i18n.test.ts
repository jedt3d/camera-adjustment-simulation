// Copyrights © 2026 by Worajedt Sitthidumrong

import { describe, expect, it } from 'vitest';
import { label, pageTitles, term } from './i18n';

describe('i18n labels', () => {
  it('uses the shortened depth diagram label in both languages', () => {
    expect(pageTitles.en.depth).toBe('Depth Diagram');
    expect(pageTitles.th.depth.length).toBeGreaterThan(0);
    expect(pageTitles.th.depth).not.toContain('ของกล้อง');
  });

  it('provides the top-view label only as a reusable label', () => {
    expect(label('en', 'topView')).toBe('Top View');
    expect(label('th', 'language')).toBe('ภาษา');
  });

  it('uses standard Thai photography terms for core controls', () => {
    expect(term('th', 'aperture')).toBe('รูรับแสง');
    expect(term('th', 'shutterSpeed')).toBe('ความเร็วชัตเตอร์');
    expect(term('th', 'iso')).toBe('ความไวแสง ISO');
    expect(term('th', 'focalLength')).toBe('ความยาวโฟกัส');
    expect(term('th', 'actualDof')).toContain('ระยะชัดลึก');
  });
});
