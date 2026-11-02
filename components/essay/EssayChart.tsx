import { LineChart } from "@/components/LineChart";
import { getChart } from "@/lib/content";
import { keepRangesTogether as keep } from "@/lib/typography";

/**
 * <Chart id="…" /> in an essay: a chart from content/charts/<id>.json, wider than the text,
 * with its title, the highest actual and the latest forecast labelled, and the source beneath.
 */
export function EssayChart({ id }: { id: string }) {
  const chart = getChart(id);
  const points = chart.points.map((p) => ({ label: p.year, value: p.value }));
  const forecast = chart.firstForecast
    ? points.findIndex((p) => p.label === chart.firstForecast)
    : undefined;
  const actual = forecast === undefined ? points : points.slice(0, forecast);
  const peak = actual.reduce((top, p, i) => (p.value > actual[top].value ? i : top), 0);
  const last = points.length - 1;

  return (
    <figure className="essay-wide my-14 rounded-card bg-paper px-5 py-6 font-sans shadow-e1 md:px-10 md:py-9">
      <p className="font-serif text-lead font-semibold">{keep(chart.title)}</p>
      {chart.subtitle && <p className="mt-1 text-small text-muted">{keep(chart.subtitle)}</p>}
      <LineChart
        className="mt-6"
        points={points}
        firstForecast={forecast}
        yMax={Math.ceil(Math.max(...points.map((p) => p.value)) + 0.5)}
        labelled={[...new Set([0, peak, last])]}
        highlight={last}
        ariaLabel={chart.summary}
        unit={chart.unit}
      />
      <figcaption className="mt-4 text-small text-muted">Source: {keep(chart.source)}</figcaption>
    </figure>
  );
}
