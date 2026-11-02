import Link from "next/link";
import { EssayFeature } from "@/components/EssayFeature";
import { LineChart } from "@/components/LineChart";
import { Section } from "@/components/Section";
import { firstChartId, getChart, type Post } from "@/lib/content";
import { formatDate } from "@/lib/format";

const link =
  "inline-flex min-h-11 items-center rounded-[4px] text-small font-semibold text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal";

const meta = (post: Post) =>
  `No. ${post.number}, ${formatDate(post.date)}, ${post.readingMinutes} min read`;

// The newest essay as the large card; older essays (or an honest placeholder) beside it.
export function WritingSection({
  posts,
  copy,
}: {
  posts: Post[];
  copy: { heading: string; intro: string; emptySlot: string };
}) {
  const [latest, ...older] = posts;
  const chartId = firstChartId(latest.body);
  const chart = chartId ? getChart(chartId) : undefined;
  const points = chart?.points.map((p) => ({ label: p.year, value: p.value }));

  return (
    <Section id="writing" title={copy.heading} intro={copy.intro}>
      <div className="mt-12 grid gap-10 pt-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
        <EssayFeature
          href={`/writing/${latest.slug}`}
          meta={meta(latest)}
          title={latest.title}
          summary={latest.summary}
          keyFigure={latest.keyFigures?.[0]}
          chartCaption={chart?.caption}
          chart={
            chart &&
            points && (
              <LineChart
                points={points}
                firstForecast={
                  chart.firstForecast
                    ? points.findIndex((p) => p.label === chart.firstForecast)
                    : undefined
                }
                yMax={Math.ceil(Math.max(...points.map((p) => p.value)) + 0.5)}
                labelled={[0, points.length - 1]}
                highlight={points.length - 1}
                ariaLabel={chart.summary}
                unit={chart.unit}
              />
            )
          }
        />
        <div className="flex flex-col gap-4 lg:pt-10">
          {older.slice(0, 2).map((post) => (
            <article
              key={post.slug}
              className="group relative rounded-card bg-paper p-6 shadow-e1 transition-[translate,box-shadow] duration-(--dur-hover) ease-out is-hover:-translate-y-0.5 is-hover:shadow-e2"
            >
              <p className="text-small text-muted">{meta(post)}</p>
              <h3 className="mt-2 text-h3">
                <Link
                  href={`/writing/${post.slug}`}
                  className="rounded-[4px] after:absolute after:inset-0"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-2 text-slate">{post.summary}</p>
            </article>
          ))}
          {/* With one essay, a plain line rather than a placeholder card. */}
          {older.length === 0 && <p className="text-lead text-slate">{copy.emptySlot}</p>}
          <p className="flex flex-wrap gap-x-6">
            <Link href="/writing" className={link}>
              All essays
            </Link>
            <Link href="/rss.xml" className={link}>
              Follow by RSS
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
