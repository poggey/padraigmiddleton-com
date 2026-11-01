import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getPosts, getProjects } from "@/lib/content";
import { renderMdx } from "./render";

// Stand-ins for the essay components, which are built in Phase 8.
const stub = (name: string) => {
  const Stub = () => <div data-component={name} />;
  Stub.displayName = name;
  return Stub;
};
const components = Object.fromEntries(
  ["Chart", "HeadroomSlider", "Prediction", "PullQuote", "Figure", "WhereIMightBeWrong"].map(
    (n) => [n, stub(n)],
  ),
);

describe("renderMdx", () => {
  it("compiles every essay, with footnotes and its components", async () => {
    for (const post of getPosts({ includeDrafts: true })) {
      const html = renderToStaticMarkup(await renderMdx(post.body, components));
      expect(html).toContain('data-footnotes="true"');
      expect(html).toContain('data-component="Prediction"');
    }
  });

  it("compiles every project write-up", async () => {
    for (const project of getProjects()) {
      expect(
        renderToStaticMarkup(await renderMdx(project.body, components)).length,
      ).toBeGreaterThan(50);
    }
  });

  it("keeps number ranges on one line", async () => {
    const html = renderToStaticMarkup(await renderMdx("From 2019–20 to 2031–32.", components));
    expect(html).toContain("2019⁠–⁠20");
  });

  it("fails loudly when a component is missing", async () => {
    await expect(async () =>
      renderToStaticMarkup(await renderMdx("<Unknown />", {})),
    ).rejects.toThrow(/Unknown/);
  });
});
