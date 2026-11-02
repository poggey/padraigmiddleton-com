import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { projectSeries } from "@/components/reviews/projectSeries";
import { ReviewBar } from "@/components/reviews/ReviewBar";
import { SurveyMap } from "@/components/reviews/survey/ContourMap";
import { ProfileChart } from "@/components/reviews/survey/ProfileChart";
import { formatDate } from "@/lib/format";
import { reviewContent, splitHeadline } from "@/lib/reviews";
import gilts from "@/public/data/gilt-curves.json";
import history from "@/public/data/reviews/gilt-history.json";

export const metadata = { title: "B. Survey" };

const button =
  "inline-flex h-11 items-center justify-center px-5 text-ui font-medium transition-[background-color,color,box-shadow] duration-(--dur-hover) ease-out";
const primary = `${button} bg-signal text-paper is-hover:bg-signal-deep`;
const secondary = `${button} bg-paper/80 text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--ink)]`;

// Where things sit on the map: time left to right, maturity (square-root scale) bottom to top.
const weeks = history.curves.length;
const xOf = (iso: string) => history.curves.findIndex((c) => c.date >= iso) / (weeks - 1);
const yOf = (m: number) => {
  const [first, last] = [history.maturities[0], history.maturities.at(-1)!];
  return 1 - (Math.sqrt(m) - Math.sqrt(first)) / (Math.sqrt(last) - Math.sqrt(first));
};
const tenYear = (yields: number[]) => yields[history.maturities.indexOf(10)];

// The 10-year yield over the same ten years, drawn as one wandering contour between sections.
function ContourRule() {
  const series = history.curves.map((c) => tenYear(c.yields));
  const lo = Math.min(...series);
  const hi = Math.max(...series);
  const d = series
    .map(
      (v, i) =>
        `${i ? "L" : "M"}${((i / (weeks - 1)) * 1000).toFixed(1)},${(22 - ((v - lo) / (hi - lo)) * 20).toFixed(1)}`,
    )
    .join("");
  return (
    <Reveal>
      <svg
        aria-hidden
        viewBox="0 0 1000 24"
        preserveAspectRatio="none"
        className="block h-6 w-full"
      >
        <path
          data-draw
          pathLength={1}
          d={d}
          fill="none"
          stroke="var(--contour)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Reveal>
  );
}

export default function SurveyPrototype() {
  const { site, latest, roles, education, featured, alsoBuilt } = reviewContent();
  const [lead, rest] = splitHeadline(site.hero.headline);
  const today10 = tenYear(gilts.curves.at(-1)!.yields);
  const years = [2018, 2020, 2022, 2024, 2026];

  return (
    <div className="proposal-survey min-h-svh pb-24 font-sans">
      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href="/reviews/survey" className="font-semibold">
            Padraig Middleton
          </Link>
          <nav aria-label="Main" className="flex items-center gap-6 text-small">
            <Link href="/writing" className="max-md:hidden is-hover:text-signal">
              Writing
            </Link>
            <Link href="/projects" className="max-md:hidden is-hover:text-signal">
              Projects
            </Link>
            <Link href="/about" className="max-md:hidden is-hover:text-signal">
              About
            </Link>
            <a href={site.contact.cv} className="font-semibold text-signal">
              Download CV
            </a>
          </nav>
        </Container>
      </header>

      <section aria-labelledby="hero-heading" className="relative border-b border-line">
        <div className="relative h-[20rem] md:h-[calc(100svh-7rem)] md:min-h-[38rem] md:max-h-[58rem]">
          <SurveyMap
            data={history}
            gold={today10}
            className="absolute inset-0 size-full md:mask-[linear-gradient(to_right,rgb(0_0_0/0.3)_0%,rgb(0_0_0/0.3)_30%,#000_60%)]"
          />
          {/* Map labels: years along the foot, maturities up the right edge, one place name. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 text-[0.75rem] tracking-[0.04em] text-muted"
          >
            {years.map((year) => (
              <span
                key={year}
                className="absolute bottom-2 -translate-x-1/2"
                style={{ left: `${xOf(`${year}-01-01`) * 100}%` }}
              >
                {year}
              </span>
            ))}
            {[1, 5, 10, 30].map((m) => (
              <span
                key={m}
                className="absolute right-3 -translate-y-1/2 first:-translate-y-full last:translate-y-1"
                style={{ top: `${yOf(m) * 100}%` }}
              >
                {m}y
              </span>
            ))}
            <span
              className="absolute -translate-x-1/2 font-serif text-small text-slate italic max-md:hidden"
              style={{ left: `${xOf("2022-09-23") * 100}%`, top: "8%" }}
            >
              Mini-budget, September 2022
            </span>
          </div>
          <Container className="pointer-events-none relative z-10 hidden h-full items-center md:flex">
            <HeroText lead={lead} rest={rest} site={site} latest={latest.slug} />
          </Container>
        </div>
        <Container className="py-12 md:hidden">
          <HeroText lead={lead} rest={rest} site={site} latest={latest.slug} />
        </Container>
        {/* The map's key. */}
        <Container className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line py-4 text-small text-muted">
          <span>Contour interval 0.25 percentage points</span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-5 bg-[rgb(var(--water)/0.3)]" /> Yields under 2%
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-gilt" /> Today’s 10-year yield, {today10.toFixed(2)}%
          </span>
          <span>Bank of England gilt curves, weekly, to {formatDate(history.asOf)}</span>
        </Container>
        <p className="sr-only">
          The map shows UK government bond yields from 1 to 30 years, every week for ten years.
          Yields were mostly under 2% until 2022, rose sharply in 2022, and are highest now at the
          long end.
        </p>
      </section>

      <section aria-labelledby="experience-heading" className="py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="experience-heading" className="text-h2">
              Experience
            </h2>
            <a href={site.contact.cv} className={`${secondary} mt-6`}>
              Download CV
            </a>
          </div>
          <div>
            <Gazetteer
              rows={roles.map((r) => ({
                key: r.id,
                title: r.organisation,
                detail: `${r.role}, ${r.location}`,
                note: r.bullets[0],
                dates: r.dates,
              }))}
            />
            <h3 className="mt-14 text-h3">Education</h3>
            <Gazetteer
              rows={education.map((e) => ({
                key: e.id,
                title: e.institution,
                detail: e.qualification,
                note: e.points[0],
                dates: e.dates,
              }))}
            />
          </div>
        </Container>
      </section>

      <Container>
        <ContourRule />
      </Container>

      <section aria-labelledby="writing-heading" className="py-16 md:py-24">
        <Container>
          <h2 id="writing-heading" className="text-h2">
            {site.sections.writing.heading}
          </h2>
          <Link
            href={`/writing/${latest.slug}`}
            className="group mt-10 block border border-line-strong bg-paper p-1"
          >
            <div className="grid gap-8 border border-line p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
              <div>
                <p className="text-small tracking-[0.04em] text-muted">
                  No. {latest.number} · {formatDate(latest.date)} · {latest.readingMinutes} min read
                </p>
                <h3 className="mt-4 text-title transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                  {latest.title}
                </h3>
                <p className="mt-5 max-w-[50ch] text-lead text-slate">{latest.summary}</p>
              </div>
              <span className={`${primary} lg:justify-self-end`}>Read the essay</span>
            </div>
          </Link>
        </Container>
      </section>

      <Container>
        <ContourRule />
      </Container>

      <section id="projects" aria-labelledby="projects-heading" className="py-16 md:py-24">
        <Container>
          <h2 id="projects-heading" className="text-h2">
            {site.sections.projects.heading}
          </h2>
          <p className="mt-4 max-w-[48ch] text-lead text-slate">{site.sections.projects.intro}</p>
          <ul className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-2">
            {featured.map((project, i) => {
              const series = projectSeries(project.slug);
              return (
                <li key={project.slug} className="min-w-0">
                  <Link href={project.href} className="group block">
                    {series && <ProfileChart series={series} id={project.slug} />}
                    <p className="mt-4 text-small tracking-[0.04em] text-muted">
                      Sheet {String(i + 1).padStart(2, "0")} · {project.kind}
                    </p>
                    <h3 className="mt-1 text-h3 transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-[50ch] text-slate">{project.oneLine}</p>
                    {project.key.todo && (
                      <p className="mt-3 w-fit bg-gilt/15 px-2 py-0.5 text-small">
                        TODO(Padraig): {project.key.todo}
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-14 border-t border-line pt-6 text-slate">
            <span className="font-semibold text-ink">Also built: </span>
            {alsoBuilt.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && ", "}
                <Link
                  href={`/projects/${p.slug}`}
                  className="text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal"
                >
                  {p.title}
                </Link>
              </span>
            ))}
            .
          </p>
        </Container>
      </section>

      <section
        aria-labelledby="contact-heading"
        className="border-t border-line bg-porcelain py-16 md:py-24"
      >
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 id="contact-heading" className="text-h2">
              {site.sections.contact.heading}
            </h2>
            <p className="mt-5 max-w-[42ch] text-lead text-slate">{site.sections.contact.line}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${site.contact.email}`} className={primary}>
                Email me
              </a>
              <a href={site.contact.linkedin} className={secondary}>
                LinkedIn
              </a>
              <a href={site.contact.github} className={secondary}>
                GitHub
              </a>
            </div>
          </div>
          <NorthArrow />
        </Container>
        <Container>
          <p className="mt-14 border-t border-line pt-6 text-small text-muted">
            Set in Schibsted Grotesk and Source Serif 4. The map is drawn from Bank of England gilt
            curves, last updated {formatDate(gilts.asOf)}.
          </p>
        </Container>
      </section>

      <ReviewBar current="survey" />
    </div>
  );
}

function HeroText({
  lead,
  rest,
  site,
  latest,
}: {
  lead: string;
  rest: string;
  site: ReturnType<typeof reviewContent>["site"];
  latest: string;
}) {
  return (
    <div className="pointer-events-auto max-w-[36rem]">
      <h1 id="hero-heading" className="text-display">
        {lead}
        <span className="text-muted">{rest}</span>
      </h1>
      <p className="mt-6 max-w-[36ch] text-lead text-slate">{site.hero.subline}</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href={`/writing/${latest}`} className={primary}>
          {site.hero.primaryButton}
        </Link>
        <a href="#projects" className={secondary}>
          {site.hero.secondaryButton}
        </a>
      </div>
    </div>
  );
}

// Roles listed like a gazetteer: name, then where and what, then the dates on the right.
function Gazetteer({
  rows,
}: {
  rows: { key: string; title: string; detail?: string; note: string; dates: string }[];
}) {
  return (
    <ol className="mt-4 border-t border-line-strong">
      {rows.map((row) => (
        <li
          key={row.key}
          className="grid gap-1 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-8"
        >
          <div>
            <p className="font-semibold">{row.title}</p>
            {row.detail && <p className="text-slate">{row.detail}</p>}
            <p className="mt-2 max-w-[62ch] text-small text-muted">{row.note}</p>
          </div>
          <p className="text-small text-muted md:text-right">{row.dates}</p>
        </li>
      ))}
    </ol>
  );
}

// A north arrow, as on every map sheet. Decorative.
function NorthArrow() {
  return (
    <svg aria-hidden viewBox="0 0 40 64" className="h-16 w-10 text-slate max-lg:hidden">
      <text x={20} y={12} textAnchor="middle" fontSize={12} fontWeight={600} fill="currentColor">
        N
      </text>
      <path d="M20 18 L28 58 L20 50 L12 58 Z" fill="none" stroke="currentColor" strokeWidth={1} />
      <path d="M20 18 L20 50 L12 58 Z" fill="currentColor" />
    </svg>
  );
}
