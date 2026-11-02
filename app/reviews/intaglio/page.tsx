import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import {
  CertificateBorder,
  EngravedRule,
  EngravingDefs,
} from "@/components/reviews/intaglio/Engraving";
import { Rosette } from "@/components/reviews/intaglio/Rosette";
import { ReviewBar } from "@/components/reviews/ReviewBar";
import { formatDate } from "@/lib/format";
import { reviewContent, splitHeadline, type FeaturedProject } from "@/lib/reviews";
import gilts from "@/public/data/gilt-curves.json";

export const metadata = { title: "A. Intaglio" };

// Serial numbers in the style of a note: PM-0001-2026 for essay No. 1 of 2026.
const serial = (n: number, year: string | number) => `PM-${String(n).padStart(4, "0")}-${year}`;

const button =
  "inline-flex h-11 items-center justify-center px-5 text-ui font-medium transition-[background-color,color,box-shadow] duration-(--dur-hover) ease-out";
const primary = `${button} bg-ink text-paper is-hover:bg-signal`;
const secondary = `${button} text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] is-hover:shadow-[inset_0_0_0_1px_var(--ink)]`;

export default function IntaglioPrototype() {
  const { site, latest, roles, education, featured, alsoBuilt } = reviewContent();
  const [lead, rest] = splitHeadline(site.hero.headline);

  return (
    <div className="proposal-intaglio min-h-svh pb-24 font-sans">
      <EngravingDefs />

      <header className="border-b border-line">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href="/reviews/intaglio" className="font-serif text-lead font-semibold">
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

      {/* Hero: set like the face of a note. Headline as the denomination, the rosette beside it. */}
      <section aria-labelledby="hero-heading" className="pt-6 md:pt-10">
        <Container>
          <div className="relative border border-line-strong p-1.5">
            <div className="relative grid items-center gap-6 border border-line px-6 py-12 md:px-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:py-16">
              <p className="absolute top-4 right-5 text-small text-gilt-deep md:right-7">
                {serial(latest.number, latest.date.slice(0, 4))}
              </p>
              <div className="relative z-10 max-lg:pt-4">
                <h1
                  id="hero-heading"
                  className="font-serif text-[clamp(2.75rem,1.9rem+3.6vw,5.25rem)] leading-[1.02] font-medium tracking-[-0.02em]"
                >
                  {lead}
                  <span className="text-muted">{rest}</span>
                </h1>
                <p className="mt-7 max-w-[38ch] text-lead text-slate">{site.hero.subline}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/writing/${latest.slug}`} className={primary}>
                    {site.hero.primaryButton}
                  </Link>
                  <a href="#projects" className={secondary}>
                    {site.hero.secondaryButton}
                  </a>
                </div>
              </div>
              <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
                <Rosette data={gilts} className="absolute inset-0 size-full" />
              </div>
            </div>
          </div>
          <p className="sr-only">
            The rosette is drawn from UK government bond yield curves over the last 60 trading days,
            with the latest close, {formatDate(gilts.asOf)}, in gold. Source: Bank of England.
          </p>
        </Container>
      </section>

      <Container>
        <EngravedRule className="mt-20" />
      </Container>

      {/* Experience and education: a register, ruled like a ledger page. */}
      <section aria-labelledby="experience-heading" className="py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="experience-heading" className="font-serif text-h2 font-medium">
              Experience
            </h2>
            <a href={site.contact.cv} className={`${secondary} mt-6`}>
              Download CV
            </a>
          </div>
          <div>
            <ol className="border-t border-line-strong">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="grid gap-1 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-8"
                >
                  <div>
                    <h3 className="font-serif text-h3 font-medium">{role.organisation}</h3>
                    <p className="mt-1 text-slate">{role.role}</p>
                    <p className="mt-3 max-w-[60ch] text-small text-muted">{role.bullets[0]}</p>
                  </div>
                  <p className="text-small text-muted md:text-right">{role.dates}</p>
                </li>
              ))}
            </ol>
            <h3 className="mt-14 font-serif text-h3 font-medium">Education</h3>
            <ol className="mt-4 border-t border-line-strong">
              {education.map((school) => (
                <li
                  key={school.id}
                  className="grid gap-1 border-b border-line py-5 md:grid-cols-[minmax(0,1fr)_14rem] md:gap-8"
                >
                  <div>
                    <p className="font-semibold">{school.institution}</p>
                    {school.qualification && (
                      <p className="mt-1 text-slate">{school.qualification}</p>
                    )}
                    <p className="mt-3 max-w-[60ch] text-small text-muted">{school.points[0]}</p>
                  </div>
                  <p className="text-small text-muted md:text-right">{school.dates}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <Container>
        <EngravedRule />
      </Container>

      {/* Writing: the latest essay as a numbered note, its headline figure engraved large. */}
      <section aria-labelledby="writing-heading" className="py-16 md:py-20">
        <Container>
          <h2 id="writing-heading" className="font-serif text-h2 font-medium">
            {site.sections.writing.heading}
          </h2>
          <Link
            href={`/writing/${latest.slug}`}
            className="group relative mt-10 block px-7 py-12 text-(--engrave) transition-colors duration-(--dur-ui) is-hover:text-gilt md:px-14 md:py-16"
          >
            <CertificateBorder seedKey={latest.slug} />
            <div className="relative grid gap-10 text-ink lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <p className="text-small text-muted">
                  No. {latest.number} · {formatDate(latest.date)} · {latest.readingMinutes} min read
                </p>
                <h3 className="mt-4 font-serif text-title font-medium">{latest.title}</h3>
                <p className="mt-5 max-w-[48ch] text-lead text-slate">{latest.summary}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold text-signal">
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
                <Reveal className="lg:border-l lg:border-line lg:pl-10">
                  <p className="settle font-serif text-[clamp(4rem,3rem+4vw,7rem)] leading-none font-medium tracking-[-0.03em]">
                    {latest.keyFigures[0].figure}
                  </p>
                  <p className="mt-3 max-w-[30ch] text-small text-slate">
                    {latest.keyFigures[0].label}
                  </p>
                </Reveal>
              )}
            </div>
          </Link>
        </Container>
      </section>

      <Container>
        <EngravedRule />
      </Container>

      {/* Projects: each one a certificate, its border generated from the project, its key number engraved. */}
      <section id="projects" aria-labelledby="projects-heading" className="py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="projects-heading" className="font-serif text-h2 font-medium">
                {site.sections.projects.heading}
              </h2>
              <p className="mt-4 max-w-[48ch] text-lead text-slate">
                {site.sections.projects.intro}
              </p>
            </div>
          </div>
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <li key={project.slug} className="min-w-0">
                <Reveal className="h-full">
                  <Certificate project={project} index={i} />
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="mt-14 grid gap-4 border-t border-line pt-6 md:grid-cols-[16rem_minmax(0,1fr)]">
            <h3 className="font-semibold">Also built</h3>
            <ul className="space-y-3">
              {alsoBuilt.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="font-semibold is-hover:text-signal">
                    {p.title}
                  </Link>
                  <span className="text-slate">. {p.oneLine}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Contact and colophon. */}
      <section
        aria-labelledby="contact-heading"
        className="border-t border-line-strong bg-porcelain py-16 md:py-24"
      >
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h2 id="contact-heading" className="font-serif text-h2 font-medium">
              {site.sections.contact.heading}
            </h2>
            <p className="mt-5 max-w-[40ch] text-lead text-slate">{site.sections.contact.line}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${site.contact.email}`} className={primary}>
                Email me
              </a>
              <a href={site.contact.cv} className={secondary}>
                Download CV
              </a>
            </div>
          </div>
          <dl className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 gap-y-4 self-end border-t border-line-strong pt-6 text-small">
            <dt className="text-muted">Email</dt>
            <dd>
              <a href={`mailto:${site.contact.email}`} className="is-hover:text-signal">
                {site.contact.email}
              </a>
            </dd>
            <dt className="text-muted">LinkedIn</dt>
            <dd>
              <a href={site.contact.linkedin} className="is-hover:text-signal">
                padraig-middleton
              </a>
            </dd>
            <dt className="text-muted">GitHub</dt>
            <dd>
              <a href={site.contact.github} className="is-hover:text-signal">
                poggey
              </a>
            </dd>
          </dl>
        </Container>
        <Container>
          <p className="mt-16 max-w-[80ch] border-t border-line pt-6 text-small text-muted">
            Set in Source Serif 4 and Schibsted Grotesk. The rosette is drawn from Bank of England
            gilt curves, last updated {formatDate(gilts.asOf)}. Built with Next.js; the code is on
            GitHub.
          </p>
        </Container>
      </section>

      <ReviewBar current="intaglio" />
    </div>
  );
}

function Certificate({ project, index }: { project: FeaturedProject; index: number }) {
  return (
    <Link
      href={project.href}
      className="group relative flex h-full min-h-[24rem] flex-col items-center px-10 py-14 text-center text-(--engrave-faint) transition-colors duration-(--dur-ui) is-hover:text-gilt"
    >
      <CertificateBorder seedKey={project.slug} />
      <p className="relative text-small text-muted">
        No. {String(index + 1).padStart(2, "0")} · {project.kind}
      </p>
      <div className="relative my-auto py-6 text-ink">
        <p className="settle font-serif text-[clamp(3.25rem,2.6rem+2.2vw,4.5rem)] leading-none font-medium tracking-[-0.03em]">
          {project.key.figure}
        </p>
        <p className="mx-auto mt-3 max-w-[28ch] text-small text-slate">{project.key.label}</p>
        {project.key.todo && (
          <p className="mx-auto mt-2 max-w-[28ch] bg-gilt/15 px-2 py-0.5 text-small">
            TODO(Padraig): {project.key.todo}
          </p>
        )}
      </div>
      <p className="relative font-serif text-h3 font-medium text-ink transition-colors duration-(--dur-hover) group-is-hover:text-signal">
        {project.title}
      </p>
    </Link>
  );
}
