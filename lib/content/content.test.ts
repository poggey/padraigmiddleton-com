import { describe, expect, it } from "vitest";
import { extractFootnotes } from "./footnotes";
import {
  getExperience,
  getPost,
  getPosts,
  getProjects,
  getSite,
  validateContent,
} from "./index";
import { parseContent, postSchema, projectSchema } from "./schemas";

const validPost = {
  title: "The bill Britain keeps signing",
  number: 1,
  date: "2026-11-03",
  summary: "A summary.",
  tags: ["Gilts"],
  draft: false,
};

describe("schemas", () => {
  it("accepts a complete post", () => {
    expect(parseContent(postSchema, validPost, "test.mdx").title).toBe(validPost.title);
  });

  it("names the file and the field when a required field is missing", () => {
    const { title: _title, ...missing } = validPost;
    expect(() => parseContent(postSchema, missing, "content/posts/x.mdx")).toThrow(
      /content\/posts\/x\.mdx[\s\S]*title/,
    );
  });

  it("rejects a date that is not ISO", () => {
    expect(() => parseContent(postSchema, { ...validPost, date: "3 November 2026" }, "x")).toThrow(/date/);
  });

  it("rejects a project in an unknown group", () => {
    const project = getProjects()[0];
    expect(() => parseContent(projectSchema, { ...project, group: "crypto" }, "x")).toThrow(/group/);
  });
});

describe("essays", () => {
  const post = getPost("the-bill-britain-keeps-signing", { includeDrafts: true })!;

  it("loads the first essay with its frontmatter", () => {
    expect(post.number).toBe(1);
    expect(post.title).toBe("The bill Britain keeps signing");
    expect(post.keyFigures).toHaveLength(3);
  });

  it("works out reading time at 230 words a minute", () => {
    expect(post.readingMinutes).toBe(3);
  });

  it("turns footnotes into numbered sidenotes in the order they are first cited", () => {
    expect(post.footnotes.map((f) => f.id)).toEqual(["dmo", "capx", "obr", "rpi"]);
    expect(post.footnotes.map((f) => f.number)).toEqual([1, 2, 3, 4]);
    expect(post.footnotes[2].text).toMatch(/^Office for Budget Responsibility/);
  });

  it("lists essays newest first", () => {
    const numbers = getPosts({ includeDrafts: true }).map((p) => p.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => b - a));
  });
});

describe("footnotes", () => {
  it("throws when a reference has no source", () => {
    expect(() => extractFootnotes("Text.[^a]", "x.mdx")).toThrow(/no source for \[\^a\]/);
  });

  it("throws when a source is never referenced", () => {
    expect(() => extractFootnotes("Text.\n\n[^a]: Source.", "x.mdx")).toThrow(/never referenced/);
  });
});

describe("projects", () => {
  const projects = getProjects();

  it("loads all eight in display order", () => {
    expect(projects.map((p) => p.slug)).toEqual([
      "risk-dashboard",
      "fourier-option-pricing",
      "portfolio-optimiser",
      "escape-velocity",
      "stirling",
      "the-slate",
      "apex",
      "marginalia",
    ]);
  });

  it("has no key result for Escape Velocity, and no open TODOs on any project", () => {
    expect(projects.find((p) => p.slug === "escape-velocity")!.keyResult).toBeUndefined();
    for (const project of projects) {
      expect(project.todo, project.slug).toBeUndefined();
      expect(project.body, project.slug).not.toContain("<Todo>");
    }
  });

  it("features the finance and economics work; F1 and books are listed as also built", () => {
    expect(projects.filter((p) => !p.featured).map((p) => p.slug)).toEqual(["apex", "marginalia"]);
  });
});

describe("data files", () => {
  it("loads five roles and two schools", () => {
    const experience = getExperience();
    expect(experience.roles.map((r) => r.organisation)).toEqual([
      "Zaltek Digital",
      "Raymond James",
      "Parkdean Resorts",
      "ICD Energy",
      "UK Parliament, House of Lords",
    ]);
    expect(experience.education).toHaveLength(2);
  });

  it("publishes only email, LinkedIn and GitHub as contact details", () => {
    expect(Object.keys(getSite().contact).sort()).toEqual(["cv", "email", "github", "linkedin"]);
  });
});

describe("validateContent", () => {
  it("passes for the content as it stands", () => {
    expect(() => validateContent()).not.toThrow();
  });
});
