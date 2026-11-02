import { getPredictions } from "@/lib/content";
import { formatDate } from "@/lib/format";

/**
 * The essay's dated prediction, on a night card. The claim is the essay's own paragraph, passed
 * as children; the dates and how it will be judged come from content/predictions.json.
 */
export function Prediction({ id, children }: { id: string; children: React.ReactNode }) {
  const prediction = getPredictions().find((p) => p.id === id);
  if (!prediction) throw new Error(`<Prediction id="${id}" /> is not in content/predictions.json`);

  return (
    <aside
      aria-label="Prediction"
      data-tone="night"
      className="my-12 rounded-card bg-night px-6 py-7 md:px-10 md:py-9"
    >
      <p className="flex items-center gap-2 font-sans text-small text-night-muted">
        <span aria-hidden className="size-2 rounded-full bg-gilt" />
        Prediction, made {formatDate(prediction.made)}
      </p>
      <div className="mt-4 [&_p]:mt-0 [&_p]:text-essay-dek">{children}</div>
      <p className="mt-5 font-sans text-small text-night-muted">
        To be checked on {formatDate(prediction.checkDate)}.
      </p>
      {prediction.judging && (
        <details className="group mt-4 font-sans">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-[2px] text-small font-semibold text-signal-soft [&::-webkit-details-marker]:hidden">
            How it will be judged
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 12 12"
              className="transition-transform duration-(--dur-hover) group-open:rotate-180"
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </summary>
          <p className="mt-1 max-w-[60ch] text-small text-night-muted">{prediction.judging}</p>
        </details>
      )}
    </aside>
  );
}
