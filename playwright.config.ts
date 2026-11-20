import { defineConfig, devices } from '@playwright/test';

// Accessibility gate: serves the built site (dist/) and runs axe against every page.
const PORT = 4173;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    // CI installs Playwright's Chromium; locally, reuse the installed Google Chrome.
    ...devices['Desktop Chrome'],
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
});
