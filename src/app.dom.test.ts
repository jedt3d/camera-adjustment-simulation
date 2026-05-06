// Copyrights © 2026 by Worajedt Sitthidumrong

import { beforeEach, describe, expect, it, vi } from 'vitest';

async function mountApp() {
  vi.resetModules();
  document.body.innerHTML = '<div id="app"></div>';
  await import('./main');
}

function clickPage(page: string) {
  const button = document.querySelector<HTMLButtonElement>(`[data-page="${page}"]`);
  expect(button).toBeTruthy();
  button?.click();
}

describe('app DOM behavior', () => {
  beforeEach(async () => {
    await mountApp();
  });

  it('renders the footer copyright and source-code label', () => {
    expect(document.querySelector('.app-footer')?.textContent).toContain('Copyrights © 2026 by Worajedt Sitthidumrong');
    expect(document.querySelector('.app-footer')?.textContent).toContain('Source code');
  });

  it('shows Top View only on the Depth Diagram page', () => {
    const brand = document.querySelector('#brandLabel');

    expect(brand?.classList.contains('is-hidden')).toBe(true);
    clickPage('depth');
    expect(document.querySelector('#pageTitle')?.textContent).toBe('Depth Diagram');
    expect(brand?.classList.contains('is-hidden')).toBe(false);
    expect(brand?.textContent).toBe('Top View');
    clickPage('liveview');
    expect(brand?.classList.contains('is-hidden')).toBe(true);
  });

  it('switches page labels to Thai', () => {
    const language = document.querySelector<HTMLSelectElement>('#languageSelect');
    expect(language).toBeTruthy();

    language!.value = 'th';
    language!.dispatchEvent(new Event('change', { bubbles: true }));

    expect(document.querySelector('#pageTitle')?.textContent).toBe('สามเหลี่ยมค่าแสง');
    clickPage('depth');
    expect(document.querySelector('#pageTitle')?.textContent).toBe('แผนภาพระยะชัดลึก');
    expect(document.querySelector('#brandLabel')?.textContent).toBe('มุมมองด้านบน');
  });

  it('only exposes sensor controls on sensor-dependent pages', () => {
    expect(document.querySelector('[data-topic-control="sensor"]')).toBeNull();
    clickPage('perspective');
    expect(document.querySelector('[data-topic-control="sensor"]')).toBeNull();
    clickPage('zoneFocus');
    expect(document.querySelector('[data-topic-control="sensor"]')).toBeTruthy();
    clickPage('depth');
    expect(document.querySelector('#sensor')).toBeTruthy();
    expect(document.querySelector('#cameraControls')?.classList.contains('is-hidden')).toBe(false);
  });
});
