import { test, expect } from '@playwright/test';
const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173';

// The authorized minimal redesign replaces the portrait/orbit signature with
// editorial typography and immediate access to professional experience.
for (const width of [390, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`minimal signature and first-fold experience at ${width}px / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(baseURL, { waitUntil: 'networkidle' });
      await expect(page.locator('#hero-title')).toHaveText('Complexity,made clear.');
      // TASTE.md: no italic accent inside headings; the Anton display face is set upright.
      await expect(page.locator('#hero-title em')).toHaveCSS('font-style', 'normal');
      await expect(page.locator('#experience .button')).toBeVisible();
      await expect(page.locator('#experience .button')).toHaveAttribute('href', 'case-study-professional-work.html');
      if (width === 390) {
        // styles.css (1bdc791): on narrow screens the work comes before the experience list.
        expect(await page.locator('#selected-title').evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(720);
        const order = await page.evaluate(() => ['#work', '#experience', '#more-work'].map(sel => document.querySelector(sel).getBoundingClientRect().top));
        expect(order[0]).toBeLessThan(order[1]);
        expect(order[1]).toBeLessThan(order[2]);
      } else {
        expect(await page.locator('#experience article').first().evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(650);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `qa-artifacts/hero-${width}-${theme}.png` });
    });
  }
}

test('reduced motion removes decorative movement without hiding work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('#hero')).toBeVisible();
  await expect(page.locator('.index-card:visible')).toHaveCount(17); // Selected work + More projects
  const moving = await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === 'running').length);
  expect(moving).toBe(0);
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await expect(page.locator('.index-media img').first()).toHaveCSS('transition-duration', '0s');
});
