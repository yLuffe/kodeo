import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  workers: 2,
  reporter: 'list',
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    browserName: 'chromium',
    storageState: { cookies: [], origins: [{
      origin: 'http://127.0.0.1:3100',
      localStorage: [{ name: 'kodeo:profile:v1', value: JSON.stringify({ firstName: 'Kodeo', lessons: {}, securityExplored: false }) }],
    }] },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: {
    command: 'pnpm build && pnpm start --hostname 127.0.0.1 --port 3100',
    reuseExistingServer: !process.env.CI,
    url: 'http://127.0.0.1:3100',
    timeout: 120_000,
  },
});
