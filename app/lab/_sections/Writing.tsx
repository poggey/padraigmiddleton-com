import { readFileSync } from "node:fs";
import path from "node:path";
import { EssayFeature } from "@/components/EssayFeature";
import { LineChart } from "@/components/LineChart";
import { readingMinutes } from "@/lib/readingTime";
import chart from "@/content/charts/debt-interest-gdp.json";
import { LabSection, Label } from "./LabSection";

const essayFile = "build-kit/content/posts/the-bill-britain-keeps-signing.mdx";

function EssayCard({ force }: { force?: string }) {
  const minutes = readingMinutes(readFileSync(path.join(process.cwd(), essayFile), "utf8"));
  const points = chart.points.map((p) => ({ label: p.year, value: p.value }));
  return (
    <EssayFeature
      force={force}
      href="/writing/the-bill-britain-keeps-signing"
      meta={`No. 1, 3 November 2026, ${minutes} min read`}
      title="The bill Britain keeps signing"
      summary="Commentators called it a nothing-budget. The biggest number in it was never announced, and it goes back to 1981."
      keyFigure={{
        figure: "£15bn",
        label: "added to this year’s debt interest before a single Budget measure was counted",
      }}
      chart={
        <LineChart
          points={points}
          firstForecast={points.findIndex((p) => p.label === chart.firstForecast)}
          yMax={5}
          labelled={[0, points.length - 1]}
          highlight={points.length - 1}
          ariaLabel="Debt interest rises from 1.7% of GDP in 2019–20 to a forecast 4.2% in 2031–32."
        />
      }
      chartCaption="Debt interest, % of GDP. Source: OBR, Economic and fiscal outlook, October 2026."
    />
  );
}

export function Writing() {
  return (
    <LabSection
      id="writing"
      title="Essay card"
      intro="The chart panel overlaps the top of the card, and the key figure sits on glass. The whole card is one link."
    >
      <div className="grid gap-6 pt-6 lg:grid-cols-[2fr_1fr]">
        <EssayCard />
        <div className="flex flex-col gap-6 lg:pt-10">
          <div className="rounded-card p-6 shadow-e0">
            <p className="text-slate">Next essay in progress.</p>
          </div>
        </div>
      </div>
      <div className="mt-16 max-w-[52rem] pt-6">
        <Label>Hover: the card rises to e2 and the glass chip turns opaque</Label>
        <div className="mt-8">
          <EssayCard force="hover" />
        </div>
      </div>
    </LabSection>
  );
}
