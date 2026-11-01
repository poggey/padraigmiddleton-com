"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ProjectCard } from "@/components/ProjectCard";
import { Tabs } from "@/components/Tabs";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { spring } from "@/lib/motion";
import { Label } from "./LabSection";

const projects = [
  { title: "Portfolio Risk Dashboard", kind: "Risk analytics", group: "markets" },
  { title: "Stirling", kind: "Automated system", group: "systems" },
  { title: "The Slate", kind: "Data essay", group: "data" },
  { title: "Portfolio Optimiser", kind: "Quant finance", group: "markets" },
  { title: "Escape Velocity", kind: "Equity capital markets analysis", group: "markets" },
  { title: "APEX", kind: "Statistical model", group: "data" },
  { title: "Marginalia", kind: "Recommender", group: "systems" },
];

const filters = [
  { id: "all", label: "All" },
  { id: "markets", label: "Markets" },
  { id: "data", label: "Data" },
  { id: "systems", label: "Systems" },
];

function GraphicPlaceholder({ text, tall }: { text: string; tall?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-inline p-6 text-center text-small text-night-muted shadow-[inset_0_0_0_1px_var(--night-line)] ${tall ? "aspect-[4/3] h-full lg:aspect-auto lg:min-h-80" : "aspect-[16/9]"}`}
    >
      {text}
    </div>
  );
}

export function ProjectsDemo() {
  const [filter, setFilter] = useState("all");
  const shown = projects.filter((p) => filter === "all" || p.group === filter);

  return (
    <div className="space-y-20">
      <div>
        <Label tone="night">
          Feature card, graphic on the side, and a standard card, graphic on top. Hover for the
          spotlight.
        </Label>
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ProjectCard
            href="/projects/risk-dashboard"
            size="feature"
            layout="side"
            title="Portfolio Risk Dashboard"
            kind="Risk analytics"
            oneLine="Measures and stress-tests the risk of any portfolio: VaR, CVaR, Sharpe, Sortino, beta and drawdowns."
            status="Live"
            stack={["Python", "Streamlit", "Plotly"]}
            graphic={
              <GraphicPlaceholder
                tall
                text="Cumulative return, maximum drawdown and 95% VaR. Built in Phase 7."
              />
            }
          />
          <ProjectCard
            href="/projects/portfolio-optimiser"
            size="standard"
            title="Portfolio Optimiser"
            kind="Quant finance"
            oneLine="Markowitz optimisation on eight London-listed ETFs, and why the “best” portfolio is not to be trusted."
            status="Complete"
            stack={["Python", "pandas", "NumPy", "SciPy", "yfinance"]}
            keyResult={{
              figure: "0.76",
              label: "maximum Sharpe ratio, against −0.31 for an equal-weight portfolio",
            }}
            graphic={
              <GraphicPlaceholder text="Efficient frontier over 10,000 random portfolios. Built in Phase 7." />
            }
          />
        </div>
      </div>

      <div>
        <Label tone="night">Hover state, forced</Label>
        <div className="mt-6 max-w-md">
          <ProjectCard
            force="hover"
            href="/projects/stirling"
            size="standard"
            title="Stirling"
            kind="Automated system"
            oneLine="A daily economic briefing that decides what mattered, writes it up and files one numbered edition a day, for £0 a month."
            status="Live, updated daily"
            stack={["Next.js", "TypeScript", "Vercel"]}
            graphic={<GraphicPlaceholder text="The three latest editions. Built in Phase 7." />}
          />
        </div>
      </div>

      <div>
        <Label tone="night">Filter tabs and layout reflow</Label>
        <Tabs
          className="mt-4"
          tone="night"
          label="Filter projects"
          idPrefix="lab-filter"
          items={filters}
          value={filter}
          onChange={setFilter}
        />
        <m.ul
          layout
          id="lab-filter-panel"
          role="tabpanel"
          aria-labelledby={`lab-filter-tab-${filter}`}
          className="mt-6 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <m.li
                key={p.title}
                layout
                transition={spring}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <Card tone="night" className="h-full p-5">
                  <p className="text-ui font-semibold text-night-text">{p.title}</p>
                  <p className="mt-1 text-small text-night-muted">{p.kind}</p>
                </Card>
              </m.li>
            ))}
          </AnimatePresence>
        </m.ul>
      </div>

      <div>
        <Label tone="night">Buttons on night</Label>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button tone="night" href="/cv.pdf">
            Download CV
          </Button>
          <Button
            tone="night"
            variant="secondary"
            href="https://www.linkedin.com/in/padraig-middleton"
            external
          >
            LinkedIn
          </Button>
          <Button tone="night" variant="ghost" href="/projects">
            View all projects
          </Button>
        </div>
      </div>
    </div>
  );
}
