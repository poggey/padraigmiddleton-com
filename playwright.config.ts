import { defineConfig } from "@playwright/test";

// Screenshots at the three review widths from CLAUDE.md. Run: npm run screenshots
// Uses port 4310 and never reuses a running server, so it can't screenshot another project.
export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:4310" },
  projects: [
    { name: "1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "768", use: { viewport: { width: 768, height: 1024 } } },
    { name: "390", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: "npm run dev -- --port 4310",
    url: "http://localhost:4310",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
