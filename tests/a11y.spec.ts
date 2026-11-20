import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Every page on the site, plus a missing URL to exercise the 404 page.
const pages = [
  '/',
  '/projects/',
  '/projects/jobbr/',
  '/projects/flask-cicd-pipeline/',
  '/projects/afrimart-ecommerce/',
  '/projects/lirs-document-app/',
  '/colophon/',
  '/this-page-does-not-exist/',
];

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme });

    for (const path of pages) {
      test(`${path} has no WCAG 2.1 AA violations`, async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        const summary = results.violations.map(
          (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
        );
        expect(summary, summary.join('\n')).toEqual([]);
      });
    }
  });
}
