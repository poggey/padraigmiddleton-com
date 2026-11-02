import { describe, expect, it } from "vitest";
import { extractFootnotes } from "./footnotes";
import {
  getExperience,
  getPost,
  getPosts,
  getPredictions,
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
    expect(post.predictionId).toBe("001");
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

  it("loads all seven in display order", () => {
    expect(projects.map((p) => p.slug)).toEqual([
      "risk-dashboard",
      "stirling",
      "the-slate",
      "portfolio-optimiser",
      "escape-velocity",
      "apex",
      "marginalia",
    ]);
  });

  it("has two feature cards and five standard ones", () => {
    expect(projects.filter((p) => p.size === "feature").map((p) => p.slug)).toEqual([
      "risk-dashboard",
      "the-slate",
    ]);
  });

  it("keeps Escape Velocity's figures off the site until they are verified", () => {
    const escape = projects.find((p) => p.slug === "escape-velocity")!;
    expect(escape.keyResult).toBeUndefined();
    expect(escape.body).toContain("TODO(Padraig)");
  });
});

describe("data files", () => {
  it("loads the predictions", () => {
    expect(getPredictions()).toEqual([
      expect.objectContaining({
        id: "001",
        status: "open",
        checkDate: "2027-04-30",
        judging: expect.stringMatching(/9.3% or above counts as wrong/),
      }),
    ]);
  });

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
    expect(Object.keys(getSite().contact).sort()).toEqual(["cv", "cvTodo", "email", "github", "linkedin"]);
  });
});

describe("validateContent", () => {
  it("passes for the content as it stands", () => {
    expect(() => validateContent()).not.toThrow();
  });

  it("finds every prediction's claim word for word in its essay", () => {
    const { posts, predictions } = validateContent();
    for (const prediction of predictions) {
      const essay = posts.find((p) => p.slug === prediction.essaySlug)!;
      expect(essay.body.toLowerCase()).toContain(prediction.claim.toLowerCase());
    }
  });
});
