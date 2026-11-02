import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ReviewBar } from "@/components/reviews/ReviewBar";
import { MarketClock, TimeScrubber } from "@/components/reviews/trading-day/MarketClock";
import { paintTradingDay } from "@/components/reviews/trading-day/palette";
import { smoothCurve } from "@/lib/curves";
import { formatDate } from "@/lib/format";
import { reviewContent, splitHeadline } from "@/lib/reviews";
import gilts from "@/public/data/gilt-curves.json";

export const metadata = { title: "C. Trading day" };

const button =
  "inline-flex h-11 items-center justify-center px-5 text-ui font-medium transition-[background-color,color,box-shadow,opacity] duration-(--dur-hover) ease-out";
const primary = `${button} bg-ink text-(--ground) is-hover:opacity-85`;
const secondary = `${button} text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--ink)]`;

// Today's curve as the horizon: maturities left to right (square-root scale), higher yields as
// higher ground. In a 1000 by 400 box stretched across the bottom of the hero.
function horizon() {
  const { maturities, curves } = gilts;
  const today = curves.at(-1)!.yields;
  const r0 = Math.sqrt(maturities[0]);
  const r1 = Math.sqrt(maturities.at(-1)!);
  const xf = (m: number) => (Math.sqrt(m) - r0) / (r1 - r0);
  const at = Array.from({ length: 80 }, (_, k) => (r0 + (k / 79) * (r1 - r0)) ** 2);
  const lo = Math.min(...today);
  const hi = Math.max(...today);
  const y = (v: number) => 300 - ((v - lo) / (hi - lo)) * 250;
  const line = smoothCurve(maturities, today, at)
    .map((v, k) => `${k ? "L" : "M"}${(xf(at[k]) * 1000).toFixed(1)},${y(v).toFixed(1)}`)
    .join("");
  const labels = [0.5, 2, 5, 10, 30].map((m) => ({
    x: xf(m),
    y: y(today[maturities.indexOf(m)]) / 400,
    label: m < 1 ? "6m" : `${m}y`,
    value: today[maturities.indexOf(m)].toFixed(2),
  }));
  return { line, ground: `${line}L1000,400L0,400Z`, labels };
}

export default function TradingDayPrototype() {
  const { site, latest, roles, education, featured, alsoBuilt } = reviewContent();
  const [lead, rest] = splitHeadline(site.hero.headline);
  const h = horizon();

  return (
    <div className="proposal-trading-day min-h-svh pb-24 font-sans" suppressHydrationWarning>
      {/* Paints the palette for the current London time before the first paint. */}
      <script dangerouslySetInnerHTML={{ __html: `(${paintTradingDay.toString()})()` }} />

      <section
        aria-labelledby="hero-heading"
        className="relative flex min-h-[44rem] flex-col overflow-hidden md:min-h-svh"
        style={{ background: "linear-gradient(to bottom, var(--sky-top), var(--sky-bottom) 70%)" }}
      >
        {/* The sun (or the moon at night), placed by the clock. It sets behind the horizon. */}
        <div
          aria-hidden
          className="absolute -translate-1/2 rounded-full bg-(--sun) max-md:hidden shadow-[0_0_80px_20px_var(--sun)] transition-[left,top,width,height,background-color] duration-[1.2s] ease-out"
          style={{
            left: "var(--sun-x, 74%)",
            top: "var(--sun-y, 30%)",
            width: "var(--sun-size, 5.5rem)",
            height: "var(--sun-size, 5.5rem)",
          }}
        />

        <header className="relative z-10">
          <Container className="flex h-16 items-center justify-between gap-6 text-small">
            <Link href="/reviews/trading-day" className="text-ui font-semibold">
              Padraig Middleton
            </Link>
            <MarketClock variant="nav" />
            <nav aria-label="Main" className="flex items-center gap-6 max-md:hidden">
              <Link href="/writing" className="is-hover:text-signal">
                Writing
              </Link>
              <Link href="/projects" className="is-hover:text-signal">
                Projects
              </Link>
              <Link href="/about" className="is-hover:text-signal">
                About
              </Link>
            </nav>
          </Container>
        </header>

        <Container className="relative z-10 pt-[clamp(3rem,12svh,9rem)]">
          <h1 id="hero-heading" className="max-w-[18ch] text-display">
            {lead}
            <span className="text-muted">{rest}</span>
          </h1>
          <p className="mt-6 max-w-[38ch] text-lead text-slate">{site.hero.subline}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/writing/${latest.slug}`} className={primary}>
              {site.hero.primaryButton}
            </Link>
            <a href="#projects" className={secondary}>
              {site.hero.secondaryButton}
            </a>
          </div>
        </Container>

        {/* The horizon: today's curve, with the ground below it. */}
        <div className="relative mt-auto h-[16rem] md:h-[clamp(14rem,34svh,22rem)]">
          <Reveal className="absolute inset-0">
            <svg
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
              aria-hidden
              className="absolute inset-0 size-full"
            >
              <path d={h.ground} fill="var(--ground)" />
              <path
                data-draw
                pathLength={1}
                d={h.line}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </Reveal>
          <div aria-hidden className="absolute inset-0 text-small text-muted">
            {h.labels.map((l, i) => (
              <span
                key={l.label}
                className={`absolute mt-4 ${i === 0 ? "pl-(--gutter)" : i === h.labels.length - 1 ? "-translate-x-full pr-(--gutter)" : "-translate-x-1/2"} max-md:[&:nth-child(2)]:hidden`}
                style={{ left: `${l.x * 100}%`, top: `${l.y * 100}%` }}
              >
                {l.label} <span className="text-ink">{l.value}%</span>
              </span>
            ))}
          </div>
          <Container className="absolute inset-x-0 bottom-6 flex md:justify-end">
            <TimeScrubber />
          </Container>
        </div>
        <p className="sr-only">
          The horizon is today’s UK government bond yield curve, 6 months to 30 years, from the
          close on {formatDate(gilts.asOf)}. Source: Bank of England.
        </p>
      </section>

      <section
        aria-labelledby="experience-heading"
        className="border-t border-(--rule) py-16 md:py-24"
      >
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
        </Container>
      </section>

      <section
        aria-labelledby="writing-heading"
        className="border-t border-(--rule) py-16 md:py-24"
      >
        <Container>
          <h2 id="writing-heading" className="text-h2">
            {site.sections.writing.heading}
          </h2>
          <Link
            href={`/writing/${latest.slug}`}
            className="group mt-10 grid gap-8 border-t border-ink pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16"
          >
            <div>
              <p className="text-small text-muted">
                No. {latest.number} · {formatDate(latest.date)} · {latest.readingMinutes} min read
              </p>
              <h3 className="mt-4 text-title transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                {latest.title}
              </h3>
              <p className="mt-5 max-w-[48ch] text-lead text-slate">{latest.summary}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                Read the essay
                <span
                  aria-hidden
                  className="transition-transform duration-(--dur-hover) group-is-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
            {latest.keyFigures?.[0] && (
              <Reveal>
                <p className="settle text-[clamp(4rem,3rem+3vw,6rem)] leading-none font-semibold tracking-[-0.04em]">
                  {latest.keyFigures[0].figure}
                </p>
                <p className="mt-3 max-w-[30ch] text-small text-slate">
                  {latest.keyFigures[0].label}
                </p>
              </Reveal>
            )}
          </Link>
        </Container>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="border-t border-(--rule) py-16 md:py-24"
      >
        <Container>
          <h2 id="projects-heading" className="text-h2">
            {site.sections.projects.heading}
          </h2>
          <p className="mt-4 max-w-[48ch] text-lead text-slate">{site.sections.projects.intro}</p>
          {/* One number per project, set large on its own: no charts. */}
          <ol className="mt-12 border-t border-ink">
            {featured.map((project) => (
              <li key={project.slug} className="border-b border-(--rule)">
                <Link
                  href={project.href}
                  className="group grid gap-3 py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)_14rem]"
                >
                  <Reveal>
                    <p className="settle text-[clamp(3rem,2.4rem+2vw,4.25rem)] leading-none font-semibold tracking-[-0.04em]">
                      {project.key.figure}
                    </p>
                  </Reveal>
                  <div>
                    <h3 className="text-h3 transition-colors duration-(--dur-hover) group-is-hover:text-signal">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-slate">{project.oneLine}</p>
                    {project.key.todo && (
                      <p className="mt-3 w-fit bg-gilt/15 px-2 py-0.5 text-small">
                        TODO(Padraig): {project.key.todo}
                      </p>
                    )}
                  </div>
                  <p className="text-small text-muted md:col-start-2 lg:col-start-auto lg:text-right">
                    {project.key.label}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-slate">
            <span className="font-semibold text-ink">Also built: </span>
            {alsoBuilt.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && ", "}
                <Link
                  href={`/projects/${p.slug}`}
                  className="underline decoration-(--line-strong) underline-offset-4 is-hover:decoration-current"
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
        className="border-t border-(--rule) py-16 md:py-24"
      >
        <Container>
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
          <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-(--rule) pt-6 text-small text-muted">
            <MarketClock variant="footer" />
            <span>
              Set in Schibsted Grotesk. Today’s curve from the Bank of England,{" "}
              {formatDate(gilts.asOf)}.
            </span>
          </div>
        </Container>
      </section>

      <ReviewBar current="trading-day" />
    </div>
  );
}

function Rows({
  rows,
}: {
  rows: { key: string; title: string; detail?: string; note: string; dates: string }[];
}) {
  return (
    <ol className="mt-4 border-t border-ink">
      {rows.map((row) => (
        <li
          key={row.key}
          className="grid gap-1 border-b border-(--rule) py-5 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-8"
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
