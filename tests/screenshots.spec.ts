import { test } from "@playwright/test";

// Pages to capture. Override with PAGES="/,/lab" npm run screenshots
const pages = (process.env.PAGES ?? "/,/lab").split(",");

for (const path of pages) {
  test(`screenshot ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `screenshots/${name}-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
}
