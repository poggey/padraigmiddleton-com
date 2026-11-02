import { existsSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { graphicKeys } from "@/components/ProjectGraphic";
import { getProjects } from "./index";

describe("project graphics", () => {
  it("has a graphic component for every project", () => {
    for (const project of getProjects()) expect(graphicKeys).toContain(project.graphic);
  });

  it("has a data file under 30 KB for every project", () => {
    for (const project of getProjects()) {
      const file = `public/data/projects/${project.slug}.json`;
      expect(existsSync(file), file).toBe(true);
      expect(statSync(file).size, file).toBeLessThan(30 * 1024);
    }
  });
});
