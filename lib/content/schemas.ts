import { z } from "zod";

// Schemas for everything in content/. The shapes follow build-kit/docs/03-architecture.md.

const isoDate = z.iso.date();
const figure = z.object({ figure: z.string().min(1), label: z.string().min(1) });

export const postSchema = z.object({
  title: z.string().min(1),
  number: z.number().int().positive(),
  date: isoDate,
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  keyFigures: z.array(figure).max(3).optional(),
  predictionId: z.string().optional(),
  draft: z.boolean(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and hyphens only"),
  kind: z.string().min(1),
  oneLine: z.string().min(1),
  group: z.enum(["markets", "data", "systems"]),
  status: z.enum(["live", "complete", "in-progress"]),
  statusNote: z.string().optional(),
  year: z.number().int(),
  stack: z.array(z.string().min(1)).min(1),
  links: z.object({ live: z.url().optional(), repo: z.url() }),
  keyResult: figure.optional(),
  graphic: z.string().min(1),
  size: z.enum(["feature", "standard"]),
  order: z.number().int(),
});

export const predictionSchema = z.object({
  id: z.string().regex(/^\d{3}$/, "three digits, for example 001"),
  made: isoDate,
  claim: z.string().min(1),
  checkDate: isoDate,
  status: z.enum(["open", "right", "wrong", "void"]),
  essaySlug: z.string().min(1),
  /** How the claim will be checked, set before publishing. */
  judging: z.string().optional(),
  resolvedOn: isoDate.optional(),
  outcome: z.string().optional(),
  evidenceUrl: z.url().optional(),
});

export const experienceSchema = z.object({
  roles: z.array(
    z.object({
      id: z.string().min(1),
      organisation: z.string().min(1),
      role: z.string().min(1),
      location: z.string().min(1),
      dates: z.string().min(1),
      bullets: z.array(z.string().min(1)).min(1),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string().min(1),
      institution: z.string().min(1),
      qualification: z.string().optional(),
      dates: z.string().min(1),
      points: z.array(z.string().min(1)),
    }),
  ),
});

export const siteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  domain: z.string().min(1),
  author: z.string().min(1),
  contact: z.object({
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
    cv: z.string().startsWith("/"),
    cvTodo: z.string().optional(),
  }),
  hero: z.object({
    headline: z.string().min(1),
    headlineOptions: z.array(z.string()),
    subline: z.string().min(1),
    sublineTodo: z.string().optional(),
    primaryButton: z.string().min(1),
    secondaryButton: z.string().min(1),
  }),
  sections: z.object({
    writing: z.object({ heading: z.string(), intro: z.string(), emptySlot: z.string() }),
    projects: z.object({
      heading: z.string(),
      intro: z.string(),
      filters: z.array(z.string()),
      button: z.string(),
    }),
    experience: z.object({ heading: z.string(), button: z.string() }),
    contact: z.object({ heading: z.string(), line: z.string() }),
  }),
  about: z.object({ bio: z.string(), ownWords: z.string(), headshot: z.string() }),
  skills: z.array(z.object({ label: z.string(), items: z.string() })),
  beyondWork: z.array(z.string()),
  comingNext: z.array(z.object({ title: z.string(), todo: z.string().optional() })),
});

export type PostFrontmatter = z.infer<typeof postSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Site = z.infer<typeof siteSchema>;

/** Validates `data`, or throws an error that names the file and every problem in it. */
export function parseContent<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in ${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
