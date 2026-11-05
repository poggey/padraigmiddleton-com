import { test } from "@playwright/test";

// Pages to capture. Override with PAGES="/,/writing,/projects,/about" npm run screenshots
const pages = (process.env.PAGES ?? "/,/writing,/projects,/about").split(",");

for (const path of pages) {
  test(`screenshot ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    // Scroll through the page so anything that reveals on view has drawn in.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);

    const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `screenshots/${name}-${testInfo.project.name}.png`,
      fullPage: true,
    });
  });
}
