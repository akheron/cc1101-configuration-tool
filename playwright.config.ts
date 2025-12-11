import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -- --host --port 4174',
    url: 'http://127.0.0.1:4174/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  // Chromium-only to keep runs fast and consistent in CI.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
