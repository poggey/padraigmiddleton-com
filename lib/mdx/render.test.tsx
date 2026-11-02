import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getPosts, getProjects } from "@/lib/content";
import { renderMdx } from "./render";

// Stand-ins for the essay components, showing their props and children.
const stub = (name: string) => {
  const Stub = ({ children, ...props }: { children?: React.ReactNode }) => (
    <div data-component={name} data-props={JSON.stringify(props)}>
      {children}
    </div>
  );
  Stub.displayName = name;
  return Stub;
};
const components = Object.fromEntries(
  [
    "Chart",
    "HeadroomSlider",
    "Prediction",
    "PullQuote",
    "Figure",
    "WhereIMightBeWrong",
    "Todo",
    "Sidenote",
    "Sources",
  ].map((n) => [n, stub(n)]),
);

describe("renderMdx", () => {
  it("compiles every essay, with sidenotes, sources and its components", async () => {
    for (const post of getPosts({ includeDrafts: true })) {
      const html = renderToStaticMarkup(await renderMdx(post.body, components));
      expect(html).toContain('data-component="Sidenote"');
      expect(html).toContain('data-component="Sources"');
      expect(html).toContain('data-component="Prediction"');
    }
  });

  it("puts each source where it is cited, numbered by first citation, without back links", async () => {
    const html = renderToStaticMarkup(
      await renderMdx(
        "One.[^b] Two.[^a] Three.[^b]\n\n[^a]: Source A, [link](https://example.com).\n[^b]: Source B.",
        components,
      ),
    );
    const notes = [
      ...html.matchAll(/data-component="Sidenote" data-props="([^"]+)">(.*?)<\/div>/g),
    ];
    expect(
      notes.map(([, props, text]) => [JSON.parse(props.replaceAll("&quot;", '"')), text]),
    ).toEqual([
      [{ n: "1", id: "b" }, "Source B."],
      [{ n: "2", id: "a" }, 'Source A, <a href="https://example.com">link</a>.'],
      [{ n: "1", id: "b-2" }, "Source B."],
    ]);
    expect(html).not.toContain("↩");
    expect(html).toMatch(/data-component="Sources"[\s\S]*<ol>[\s\S]*Source B\.[\s\S]*Source A/);
  });

  it("compiles every project write-up", async () => {
    for (const project of getProjects()) {
      expect(
        renderToStaticMarkup(await renderMdx(project.body, components)).length,
      ).toBeGreaterThan(0);
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
