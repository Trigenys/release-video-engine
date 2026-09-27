import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/landing",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", {open: "never"}]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {width: 1440, height: 1000}
      }
    },
    {
      name: "chromium-mobile-320",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {width: 320, height: 800},
        isMobile: true,
        hasTouch: true
      }
    }
  ]
});
