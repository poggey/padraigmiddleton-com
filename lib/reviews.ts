import escape from "@/public/data/projects/escape-velocity.json";
import risk from "@/public/data/projects/risk-dashboard.json";
import stirling from "@/public/data/projects/stirling.json";
import { getExperience, getPosts, getProjects, getSite, type Project } from "@/lib/content";
import { formatDate } from "@/lib/format";

// Shared content for the design prototypes on /reviews. Everything here comes from content/ or
// from the projects' own exported data; the prototypes only change how it looks.

export const proposals = [
  {
    slug: "intaglio",
    letter: "A",
    name: "Intaglio",
    line: "The site as a banknote: paper, engraving green and old gold, a guilloché rosette drawn from the gilt curves, and projects as certificates.",
  },
  {
    slug: "survey",
    letter: "B",
    name: "Survey",
    line: "Ten years of gilt yields drawn as a contour map you can read with a crosshair. Projects as elevation profiles.",
  },
  {
    slug: "trading-day",
    letter: "C",
    name: "Trading day",
    line: "The site keeps London market hours: its colours follow the clock, and the hero is today’s curve as a horizon.",
  },
  {
    slug: "axis",
    letter: "E",
    name: "Axis",
    line: "Closest to the current site: the guide lines become a chart’s axes, the curves are plotted properly, and a crosshair runs down the page.",
  },
] as const;

export type ProposalSlug = (typeof proposals)[number]["slug"];

export type KeyNumber = {
  figure: string;
  label: string;
  /** Shown as a visible TODO until Padraig confirms the figure. */
  todo?: string;
};

const percent = (value: number) =>
  `${value > 0 ? "+" : "−"}${Math.abs(value * 100).toFixed(value > -0.1 && value < 0.1 ? 1 : 0)}%`;

/**
 * One number per featured project. Projects with a key result use it; the others use a figure
 * from their own exported data, labelled with what it is.
 */
export function keyNumber(project: Project): KeyNumber {
  if (project.keyResult) return project.keyResult;
  switch (project.slug) {
    case "risk-dashboard":
      return {
        figure: `−${Math.abs(risk.drawdown.depth * 100).toFixed(1)}%`,
        label: `largest fall of an equal-weight multi-asset portfolio, ${monthYear(risk.drawdown.from)} to ${monthYear(risk.drawdown.to)}`,
      };
    case "escape-velocity": {
      const firstClose = escape.series[0][1] as number;
      return {
        figure: percent(firstClose / escape.ipoPrice - 1),
        label: `first-day close above the $${escape.ipoPrice} IPO price`,
        todo: escape.verified ? undefined : "confirm this figure before launch",
      };
    }
    case "stirling":
      return {
        figure: String(stirling.editions[0].number),
        label: `numbered editions filed so far, the latest on ${formatDate(stirling.editions[0].date)}`,
      };
    default:
      return { figure: String(project.year), label: project.kind };
  }
}

function monthYear(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Everything a prototype homepage shows. */
export function reviewContent() {
  const site = getSite();
  const posts = getPosts();
  const projects = getProjects();
  const { roles, education } = getExperience();
  return {
    site,
    latest: posts[0],
    posts,
    roles,
    education,
    featured: projects
      .filter((p) => p.featured)
      .map((p) => ({ ...p, href: `/projects/${p.slug}`, key: keyNumber(p) })),
    alsoBuilt: projects.filter((p) => !p.featured),
  };
}

export type ReviewContent = ReturnType<typeof reviewContent>;
export type FeaturedProject = ReviewContent["featured"][number];

/** "Economics and markets, argued in writing" and "and tested in code.", for two-tone setting. */
export function splitHeadline(headline: string) {
  const at = headline.lastIndexOf(" and ");
  return at === -1 ? [headline, ""] : [headline.slice(0, at), headline.slice(at)];
}
