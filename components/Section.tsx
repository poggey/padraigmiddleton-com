import { Container } from "@/components/Container";
import { cx } from "@/lib/cx";

// A homepage section: one idea, a heading and an optional line of introduction.
export function Section({
  id,
  title,
  intro,
  tone = "light",
  className,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  tone?: "light" | "night";
  className?: string;
  children: React.ReactNode;
}) {
  const night = tone === "night";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-tone={night ? "night" : undefined}
      data-nav-tone={night ? "night" : undefined}
      className={cx("border-t border-frame py-(--section-y)", night && "night-band", className)}
    >
      <Container>
        <h2 id={`${id}-heading`} className="text-h2">
          {title}
        </h2>
        {intro && (
          <p
            className={cx("mt-3 max-w-[60ch] text-lead", night ? "text-night-muted" : "text-slate")}
          >
            {intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
