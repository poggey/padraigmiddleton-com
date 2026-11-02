import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { parseContent } from "./schemas";

export const chartSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  source: z.string().min(1),
  /** One line under the chart on cards. */
  caption: z.string().min(1),
  /** The takeaway in a sentence, for screen readers. */
  summary: z.string().min(1),
  unit: z.string().default(""),
  note: z.string().optional(),
  firstForecast: z.string().optional(),
  points: z.array(z.object({ year: z.string(), value: z.number() })).min(2),
});

export type ChartData = z.infer<typeof chartSchema>;

/** Chart data from content/charts/<id>.json, validated. */
export function getChart(id: string): ChartData {
  const file = path.join(process.cwd(), "content/charts", `${id}.json`);
  return parseContent(chartSchema, JSON.parse(readFileSync(file, "utf8")), `content/charts/${id}.json`);
}

/** The id of the first <Chart id="…" /> in an essay, if it has one. */
export function firstChartId(body: string) {
  return body.match(/<Chart\s+id="([^"]+)"/)?.[1];
}
