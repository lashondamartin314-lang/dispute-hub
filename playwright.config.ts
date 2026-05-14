import { defineConfig, devices } from "@playwright/test";

/**
 * Local-only Playwright config. Run with `bun run e2e`.
 *
 * Boots the Vite dev server on port 8080 and runs specs against a real
 * Chromium with a mobile viewport, which is the configuration our mobile
 * sidebar auto-scroll behavior actually targets.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
