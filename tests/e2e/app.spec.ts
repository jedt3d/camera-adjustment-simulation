// Copyrights © 2026 by Worajedt Sitthidumrong

import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  ['exposure', 'Exposure Triangle'],
  ['perspective', 'Perspective Compression'],
  ['depth', 'Depth Diagram'],
  ['liveview', 'Liveview Simulation'],
  ['sensorCrop', 'Sensor Crop Comparison'],
  ['bokeh', 'Bokeh Shape Simulator'],
  ['zoneFocus', 'Focus Plane / Zone Focus'],
  ['lensDistortion', 'Lens Distortion'],
] as const;

test.describe('visual smoke coverage', () => {
  for (const [, title] of pages) {
    test(`${title} renders without horizontal overflow`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: title }).click();
      await expect(page.locator('#pageTitle')).toHaveText(title);
      await expect(page.locator('.app-footer')).toContainText('Copyrights © 2026 by Worajedt Sitthidumrong');

      const screenshot = await page.screenshot({ fullPage: true });
      expect(screenshot.length).toBeGreaterThan(5_000);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test.describe('pixel baselines', () => {
    test.skip(!!process.env.SKIP_VISUAL_BASELINES, 'Pixel baselines are skipped in this environment.');

    for (const [pageKey, title] of pages) {
      test(`${title} matches visual baseline`, async ({ page }, testInfo) => {
        await page.goto('/');
        await page.getByRole('button', { name: title }).click();
        await expect(page.locator('#pageTitle')).toHaveText(title);
        await expect(page).toHaveScreenshot(`${pageKey}-${testInfo.project.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
        });
      });
    }
  });

  for (const [, title] of pages) {
    test(`${title} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: title }).click();
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('Thai language toggle renders the shortened depth title', async ({ page }) => {
    await page.goto('/');
    await page.locator('#languageSelect').selectOption('th');
    await page.getByRole('button', { name: 'แผนภาพระยะชัดลึก' }).click();
    await expect(page.locator('#pageTitle')).toHaveText('แผนภาพระยะชัดลึก');
    await expect(page.locator('#brandLabel')).toHaveText('มุมมองด้านบน');
  });
});
