import Link from "next/link";
import { LineChart } from "@/components/LineChart";
import { Section } from "@/components/Section";
import { firstChartId, getChart, type Post } from "@/lib/content";
import { essayParagraphs } from "@/lib/essayText";
import { formatDate } from "@/lib/format";
import { EssayFirstPage } from "./EssayFirstPage";
import { EssayTeaser } from "./EssayTeaser";

const link =
  "inline-flex min-h-11 items-center rounded-[4px] text-small font-semibold text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal";

/**
 * The newest essay, presented so it is plainly an article to open, then any older essays as a
 * ruled list. Two presentations while Padraig chooses: "page" (its first page) and "teaser"
 * (words beside its chart).
 */
export function WritingSection({
  posts,
  copy,
  variant = "page",
}: {
  posts: Post[];
  copy: { heading: string; intro: string; emptySlot: string };
  variant?: "page" | "teaser";
}) {
  const [latest, ...older] = posts;

  return (
    <Section id="writing" title={copy.heading} intro={copy.intro}>
      <div className="mt-12">
        {variant === "page" ? (
          <EssayFirstPage post={latest} opening={essayParagraphs(`${latest.slug}.mdx`)[0]} />
        ) : (
          <Teaser post={latest} />
        )}
      </div>

      {older.length > 0 && (
        <ul className="mt-10 border-t border-line">
          {older.slice(0, 3).map((post) => (
            <li key={post.slug} className="border-b border-line">
              <Link
                href={`/writing/${post.slug}`}
                className="group grid gap-1 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
              >
                <span className="text-small text-muted">
                  No. {post.number}, {formatDate(post.date)}
                </span>
                <span className="font-semibold group-hover:text-signal">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 flex flex-wrap items-center gap-x-6">
        {older.length === 0 && <span className="text-slate">{copy.emptySlot}</span>}
        <Link href="/writing" className={link}>
          All essays
        </Link>
        <Link href="/rss.xml" className={link}>
          Follow by RSS
        </Link>
      </p>
    </Section>
  );
}

function Teaser({ post }: { post: Post }) {
  const chartId = firstChartId(post.body);
  const chart = chartId ? getChart(chartId) : undefined;
  if (!chart)
    return <EssayFirstPage post={post} opening={essayParagraphs(`${post.slug}.mdx`)[0]} />;
  const points = chart.points.map((p) => ({ label: p.year, value: p.value }));
  return (
    <EssayTeaser
      post={post}
      caption={chart.caption}
      figure={
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
      }
    />
  );
}
