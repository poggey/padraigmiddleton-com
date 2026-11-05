import { defineConfig } from "@playwright/test";

// Screenshots at the three review widths from CLAUDE.md. Run: npm run screenshots
// Builds the static site and serves out/ on port 4310, so it never clashes with a dev server
// (Next allows one per project) and never reuses another project's server.
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
    command: "npm run build && python3 -m http.server 4310 --directory out",
    url: "http://localhost:4310",
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
