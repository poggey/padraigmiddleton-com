import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

type Sample = {
  token: string;
  spec: string;
  className: string;
  text: string;
};

// Sample copy is real content from build-kit/docs/04-content.md and the first essay.
const samples: Sample[] = [
  {
    token: "display",
    spec: "88 / 0.96 desktop, 48 / 1.0 mobile, 600",
    className: "text-display",
    text: "Economics and markets, argued in writing and tested in code.",
  },
  {
    token: "title",
    spec: "64 / 1.0 desktop, 40 / 1.05 mobile, 600",
    className: "text-title",
    text: "The bill Britain keeps signing",
  },
  {
    token: "h2",
    spec: "44 / 1.05 desktop, 32 / 1.1 mobile, 600",
    className: "text-h2",
    text: "Questions I wanted answered, so I built something to answer them.",
  },
  {
    token: "h3",
    spec: "26 / 1.2 desktop, 22 / 1.25 mobile, 600",
    className: "text-h3",
    text: "Portfolio Risk Dashboard",
  },
  {
    token: "lead",
    spec: "21 / 1.5 desktop, 18 / 1.5 mobile, 400",
    className: "text-lead text-slate",
    text: "Second-year Economics and Finance student at Queen Mary University of London. Looking for Summer 2027 internships.",
  },
  {
    token: "ui",
    spec: "16 / 1.5, 400",
    className: "text-ui",
    text: "Measures and stress-tests the risk of any portfolio: VaR, CVaR, Sharpe, Sortino, beta and drawdowns.",
  },
  {
    token: "small",
    spec: "14 / 1.45, 500",
    className: "text-small text-muted",
    text: "UK gilt yield curves over the last 60 trading days. Today’s in gold. Source: Bank of England.",
  },
  {
    token: "stat",
    spec: "56 / 1.0 desktop, 40 / 1.0 mobile, 600, tabular",
    className: "text-stat tabular-nums",
    text: "£15bn",
  },
  {
    token: "essay-dek",
    spec: "Source Serif 4, 24 / 1.45 desktop, 21 / 1.45 mobile, 400",
    className: "font-serif text-essay-dek text-slate",
    text: "Commentators called it a nothing-budget. The biggest number in it was never announced, and it goes back to 1981.",
  },
  {
    token: "essay-body",
    spec: "Source Serif 4, 20 / 1.75 desktop, 18 / 1.7 mobile, 400, 68 characters max",
    className: "font-serif text-essay-body max-w-[68ch]",
    text: "Index-linked gilts, or linkers, are bonds whose coupon and principal both rise with RPI (the Retail Prices Index, one measure of inflation). It’s in their name: linkers tie both the interest payments and the maturity payment directly to inflation. Linkers make up 25.2% of the UK government’s debt portfolio, higher than any other G7 country, giving the UK an unusually high exposure to its own inflation rate.",
  },
  {
    token: "pull",
    spec: "Source Serif 4, 32 / 1.3 desktop, 26 / 1.3 mobile, 400 italic",
    className: "font-serif text-pull italic",
    text: "Not tax adjustments, not spending tweaks, but a special kind of debt.",
  },
];

const debtInterest = [
  { year: "2019–20", value: "£39bn" },
  { year: "2025–26", value: "£109bn" },
  { year: "2026–27", value: "£124bn" },
  { year: "2031–32", value: "£160bn" },
];

function FigureColumn({ label, tabular }: { label: string; tabular: boolean }) {
  return (
    <div>
      <p className="text-small text-muted">{label}</p>
      <dl
        className={`mt-3 grid grid-cols-[auto_auto] gap-x-6 gap-y-1 ${tabular ? "tabular-nums" : ""}`}
      >
        {debtInterest.map((row) => (
          <div key={row.year} className="contents">
            <dt className="text-slate">{row.year}</dt>
            <dd className="text-right font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function LabPage() {
  return (
    <main className="mx-auto max-w-page px-(--gutter) py-(--section-y)">
      <h1 className="text-h2">Type scale</h1>
      <p className="mt-4 max-w-[60ch] text-lead text-slate">
        Schibsted Grotesk for the interface, Source Serif 4 for reading. Sizes scale smoothly from
        390px to 1440px wide.
      </p>

      <div className="mt-16 divide-y divide-line border-y border-line">
        {samples.map((sample) => (
          <section
            key={sample.token}
            className="grid gap-3 py-8 lg:grid-cols-[200px_1fr] lg:gap-8"
            aria-label={sample.token}
          >
            <div>
              <p className="text-small text-ink">{sample.token}</p>
              <p className="text-small text-muted">{sample.spec}</p>
            </div>
            <p className={sample.className}>{sample.text}</p>
          </section>
        ))}
      </div>

      <section className="mt-16" aria-labelledby="figures-heading">
        <h2 id="figures-heading" className="text-h3">
          Figures
        </h2>
        <p className="mt-2 max-w-[60ch] text-slate">
          Debt interest, from the first essay. Tabular figures keep the digits in columns.
        </p>
        <div className="mt-6 flex flex-wrap gap-16">
          <FigureColumn label="Proportional" tabular={false} />
          <FigureColumn label="Tabular" tabular />
        </div>
      </section>
    </main>
  );
}
