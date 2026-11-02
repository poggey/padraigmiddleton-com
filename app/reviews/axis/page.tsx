import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { AxisChart } from "@/components/reviews/axis/AxisChart";
import { AxisCrosshair, type CrosshairStop } from "@/components/reviews/axis/AxisCrosshair";
import { ReadingTick } from "@/components/reviews/axis/ReadingTick";
import { projectSeries, type ProjectSeries } from "@/components/reviews/projectSeries";
import { ReviewBar } from "@/components/reviews/ReviewBar";
import { getChart } from "@/lib/content";
import { smoothCurve } from "@/lib/curves";
import { formatDate } from "@/lib/format";
import { reviewContent, splitHeadline } from "@/lib/reviews";
import gilts from "@/public/data/gilt-curves.json";

export const metadata = { title: "E. Axis" };

// The frame: the content column's outer edges, which are the page's axes.
const frame = "mx-auto w-full max-w-[calc(var(--container)+2*var(--gutter))]";

const button =
  "inline-flex h-11 items-center justify-center px-5 text-ui font-medium transition-[background-color,color,box-shadow] duration-(--dur-hover) ease-out";

// The hero plot: maturities on a square-root scale (so the short end has room), yields upwards,
// with the curves kept high so the headline sits in the clear space beneath them.
function heroPlot() {
  const { maturities, curves } = gilts;
  const root = (m: number) => Math.sqrt(m);
  const r0 = root(maturities[0]);
  const r1 = root(maturities.at(-1)!);
  const xf = (m: number) => (root(m) - r0) / (r1 - r0);
  const at = Array.from({ length: 64 }, (_, k) => (r0 + (k / 63) * (r1 - r0)) ** 2);
  const all = curves.flatMap((c) => c.yields);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo;
  const d0 = lo - span * 2.2;
  const d1 = hi + span * 0.12;
  const yf = (v: number) => 1 - (v - d0) / (d1 - d0);
  const path = (yields: number[]) =>
    smoothCurve(maturities, yields, at)
      .map(
        (v, k) => `${k ? "L" : "M"}${(xf(at[k]) * 1000).toFixed(1)},${(yf(v) * 1000).toFixed(1)}`,
      )
      .join("");
  const today = curves.at(-1)!;
  const yesterday = curves.at(-2)!;
  const tenYear = maturities.indexOf(10);
  const yTicks = [];
  // Every whole percent gets a tick; only those the curves reach get a label, so none sit by the text.
  for (let v = Math.ceil(d0); v <= Math.floor(d1); v++)
    yTicks.push({ at: yf(v), label: v >= Math.floor(lo) ? `${v}%` : "" });
  const label = (m: number) => (m < 1 ? `${m * 12}m` : `${m}y`);
  return {
    strands: curves
      .slice(0, -1)
      .map((c, i) => ({ d: path(c.yields), age: i / (curves.length - 1) })),
    today: path(today.yields),
    xTicks: [0.5, 2, 5, 10, 30].map((m) => ({ at: xf(m), label: label(m) })),
    yTicks,
    stops: maturities.map((m, i): CrosshairStop => ({
      x: xf(m),
      y: yf(today.yields[i]),
      label: label(m),
      value: `${today.yields[i].toFixed(2)}%`,
    })),
    tenYear: today.yields[tenYear],
    tenYearMove: today.yields[tenYear] - yesterday.yields[tenYear],
  };
}

// The essay's own chart, debt interest as a share of GDP, in the Axis style.
function essaySeries(): ProjectSeries {
  const chart = getChart("debt-interest-gdp");
  const points = chart.points.map((p, i) => [i, p.value] as [number, number]);
  const last = points.at(-1)!;
  return {
    x: [0, points.length - 1],
    y: [0, 5],
    line: points,
    gold: {
      kind: "point",
      at: last,
      label: `${last[1].toFixed(1)}% in ${chart.points.at(-1)!.year}`,
    },
    xTicks: [0, points.length - 1].map((i) => ({ at: i, label: chart.points[i].year })),
    yTicks: [0, 1, 2, 3, 4, 5].map((v) => ({ at: v, label: `${v}%` })),
    summary: chart.summary ?? chart.title,
  };
}

export default function AxisPrototype() {
  const { site, latest, roles, education, featured, alsoBuilt } = reviewContent();
  const [lead, rest] = splitHeadline(site.hero.headline);
  const plot = heroPlot();
  const move = plot.tenYearMove;

  return (
    <div className="proposal-axis relative min-h-svh pb-24 font-sans">
      {/* The axes: two hairlines at the column's edges, the full height of the page. */}
      <div
        aria-hidden
        className={`${frame} pointer-events-none absolute inset-0 z-20 hidden border-x border-[rgb(140_152_175/0.34)] md:block`}
      />
      <ReadingTick />

      <section
        aria-labelledby="hero-heading"
        className="relative bg-(--axis-night) text-(--axis-text)"
        data-tone="night"
      >
        <header className={`${frame} flex h-16 items-center justify-between gap-6 px-(--gutter)`}>
          <Link href="/reviews/axis" className="font-semibold">
            Padraig Middleton
          </Link>
          <p className="text-small text-(--axis-muted) max-lg:hidden">
            10-year gilt <span className="text-(--axis-text)">{plot.tenYear.toFixed(2)}%</span>{" "}
            {Math.abs(move) < 0.005 ? (
              "unchanged"
            ) : (
              <span className={move > 0 ? "text-gilt" : "text-signal-soft"}>
                {move > 0 ? "+" : "−"}
                {Math.abs(move).toFixed(2)}
              </span>
            )}{" "}
            on {formatDate(gilts.asOf)}
          </p>
          <nav aria-label="Main" className="flex items-center gap-6 text-small">
            <Link href="/writing" className="max-md:hidden is-hover:text-signal-soft">
              Writing
            </Link>
            <Link href="/projects" className="max-md:hidden is-hover:text-signal-soft">
              Projects
            </Link>
            <Link href="/about" className="max-md:hidden is-hover:text-signal-soft">
              About
            </Link>
          </nav>
        </header>

        <div className={`${frame} relative pb-12`}>
          <div className="relative h-[13rem] border-b border-(--axis-line-strong) md:h-[clamp(36rem,86svh,54rem)]">
            {/* On phones the plot shows only the band the curves occupy: the layer is 2.5 times taller and clipped. */}
            <div className="absolute inset-0 max-md:overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[250%] md:h-full">
                <Reveal className="absolute inset-0">
                  <svg
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="absolute inset-0 size-full"
                  >
                    <g
                      data-fade
                      fill="none"
                      strokeWidth={0.8}
                      style={{ "--after": 0 } as React.CSSProperties}
                    >
                      {plot.strands.map((s, i) => (
                        <path
                          key={i}
                          d={s.d}
                          stroke="var(--axis-text)"
                          strokeOpacity={0.06 + s.age * 0.3}
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </g>
                    <path
                      data-draw
                      pathLength={1}
                      d={plot.today}
                      fill="none"
                      stroke="var(--gilt)"
                      strokeWidth={2.25}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </Reveal>
                {/* Yield ticks along the left axis. */}
                <div aria-hidden className="absolute inset-0 text-small text-(--axis-muted)">
                  {plot.yTicks.map((t) => (
                    <div
                      key={t.at}
                      className="absolute left-0 flex -translate-y-1/2 items-center"
                      style={{ top: `${t.at * 100}%` }}
                    >
                      <span className="h-px w-2 bg-(--axis-tick)" />
                      <span className="ml-2 xl:absolute xl:right-full xl:mr-5">{t.label}</span>
                    </div>
                  ))}
                </div>
                <AxisCrosshair stops={plot.stops} />
              </div>
            </div>
            {/* Maturity ticks along the bottom axis. */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 text-small text-(--axis-muted)">
              {plot.xTicks.map((t, i) => (
                <div
                  key={t.label}
                  className={`absolute top-full flex flex-col ${i === 0 ? "items-start" : i === plot.xTicks.length - 1 ? "items-end -translate-x-full" : "items-center -translate-x-1/2"}`}
                  style={{ left: `${t.at * 100}%` }}
                >
                  <span className="h-2 w-px bg-(--axis-tick)" />
                  <span className="mt-1">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 px-(--gutter) pt-14 md:absolute md:bottom-[calc(3rem+clamp(2.5rem,7svh,5rem))] md:left-0 md:pt-0">
            <h1 id="hero-heading" className="max-w-[20ch] text-display">
              {lead}
              <span className="text-(--axis-muted)">{rest}</span>
            </h1>
            <p className="mt-6 max-w-[38ch] text-lead text-(--axis-muted)">{site.hero.subline}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/writing/${latest.slug}`}
                className={`${button} bg-(--axis-text) text-(--axis-night) is-hover:bg-paper`}
              >
                {site.hero.primaryButton}
              </Link>
              <a
                href="#projects"
                className={`${button} shadow-[inset_0_0_0_1px_var(--axis-line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--axis-text)]`}
              >
                {site.hero.secondaryButton}
              </a>
            </div>
          </div>
        </div>
        <p className="sr-only">
          The chart behind the headline: UK government bond yield curves, 6 months to 30 years, over
          the last 60 trading days, with the latest close, {formatDate(gilts.asOf)}, in gold. The
          10-year yield closed at {plot.tenYear.toFixed(2)}%. Source: Bank of England.
        </p>
      </section>

      <Section n="01" label="Experience">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="text-h2">Experience</h2>
            <a
              href={site.contact.cv}
              className={`${button} mt-6 shadow-[inset_0_0_0_1px_var(--line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--ink)]`}
            >
              Download CV
            </a>
          </div>
          <div>
            <Rows
              rows={roles.map((r) => ({
                key: r.id,
                title: r.organisation,
                detail: r.role,
                note: r.bullets[0],
                dates: r.dates,
              }))}
            />
            <h3 className="mt-14 text-h3">Education</h3>
            <Rows
              rows={education.map((e) => ({
                key: e.id,
                title: e.institution,
                detail: e.qualification,
                note: e.points[0],
                dates: e.dates,
              }))}
            />
          </div>
        </div>
      </Section>

      <Section n="02" label="Writing">
        <h2 className="text-h2">{site.sections.writing.heading}</h2>
        <Link
          href={`/writing/${latest.slug}`}
          className="group mt-10 grid gap-10 border-y border-line py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16"
        >
          <div>
            <p className="text-small text-muted">
              No. {latest.number} · {formatDate(latest.date)} · {latest.readingMinutes} min read
            </p>
            <h3 className="mt-4 text-title transition-colors duration-(--dur-hover) group-is-hover:text-signal">
              {latest.title}
            </h3>
            <p className="mt-5 max-w-[46ch] text-lead text-slate">{latest.summary}</p>
            <span className="mt-8 inline-flex h-11 items-center bg-ink px-5 font-medium text-paper transition-colors duration-(--dur-hover) group-is-hover:bg-signal">
              Read the essay
            </span>
          </div>
          <figure>
            <AxisChart series={essaySeries()} />
            <figcaption className="mt-3 text-small text-muted">
              {getChart("debt-interest-gdp").title}. OBR.
            </figcaption>
          </figure>
        </Link>
      </Section>

      <Section n="03" label="Projects" id="projects">
        <h2 className="text-h2">{site.sections.projects.heading}</h2>
        <p className="mt-4 max-w-[48ch] text-lead text-slate">{site.sections.projects.intro}</p>
        {/* Small multiples: one chart frame, six projects. The 1px gaps draw the grid. */}
        <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
          {featured.map((project) => {
            const series = projectSeries(project.slug);
            return (
              <li key={project.slug} className="bg-paper">
                <Link href={project.href} className="group flex h-full flex-col p-6 md:p-8">
                  {series && <AxisChart series={series} />}
                  <p className="mt-6 text-small text-muted">{project.kind}</p>
                  <h3 className="mt-1 text-h3 transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-slate">{project.oneLine}</p>
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
        <p className="mt-8 text-slate">
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
      </Section>

      <section
        aria-labelledby="contact-heading"
        className="relative bg-(--axis-night) text-(--axis-text)"
        data-tone="night"
      >
        <SectionTick n="04" label="Contact" />
        <Container className="py-20 md:py-28">
          <h2 id="contact-heading" className="text-h2">
            {site.sections.contact.heading}
          </h2>
          <p className="mt-5 max-w-[42ch] text-lead text-(--axis-muted)">
            {site.sections.contact.line}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={`mailto:${site.contact.email}`}
              className={`${button} bg-(--axis-text) text-(--axis-night) is-hover:bg-paper`}
            >
              Email me
            </a>
            <a
              href={site.contact.linkedin}
              className={`${button} shadow-[inset_0_0_0_1px_var(--axis-line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--axis-text)]`}
            >
              LinkedIn
            </a>
            <a
              href={site.contact.github}
              className={`${button} shadow-[inset_0_0_0_1px_var(--axis-line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--axis-text)]`}
            >
              GitHub
            </a>
          </div>
          <p className="mt-20 border-t border-(--axis-line) pt-6 text-small text-(--axis-muted)">
            Set in Schibsted Grotesk. Gilt curves from the Bank of England, last updated{" "}
            {formatDate(gilts.asOf)}. Every chart is drawn from the project’s own data.
          </p>
        </Container>
      </section>

      <ReviewBar current="axis" />
    </div>
  );
}

// A light section: a gridline across the page where it starts, and a numbered tick on the axes.
function Section({
  n,
  label,
  id,
  children,
}: {
  n: string;
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-label={label} className="relative border-t border-line">
      <SectionTick n={n} label={label} />
      <Container className="py-20 md:py-28">{children}</Container>
    </section>
  );
}

// Tick marks where a section meets the axes, with its number in the margin on wide screens.
function SectionTick({ n, label }: { n: string; label: string }) {
  return (
    <div
      aria-hidden
      className={`${frame} pointer-events-none absolute inset-x-0 top-0 hidden md:block`}
    >
      <span className="absolute top-0 left-0 h-px w-2 bg-gilt xl:-left-1.5 xl:w-3" />
      <span className="absolute top-0 right-0 h-px w-2 bg-gilt xl:-right-1.5 xl:w-3" />
      <span className="absolute top-2 right-full mr-5 hidden text-small text-muted xl:block">
        {n}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function Rows({
  rows,
}: {
  rows: { key: string; title: string; detail?: string; note: string; dates: string }[];
}) {
  return (
    <ol className="mt-4 border-t border-ink/25">
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
