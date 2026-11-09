import { defineConfig } from '@playwright/test';

const publicUrl = process.env.KODEO_E2E_URL;
const baseURL = publicUrl ? publicUrl.replace(/\/*$/, '/') : 'http://127.0.0.1:3100/';

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
    baseURL,
    browserName: 'chromium',
    storageState: { cookies: [], origins: [{
      origin: new URL(baseURL).origin,
      localStorage: [{ name: 'kodeo:profile:v1', value: JSON.stringify({ firstName: 'Kodeo', lessons: {}, securityExplored: false }) }],
    }] },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  webServer: publicUrl ? undefined : {
    command: 'pnpm build && pnpm start --hostname 127.0.0.1 --port 3100',
    reuseExistingServer: !process.env.CI,
    url: baseURL,
    timeout: 120_000,
  },
});
