import { Container } from "@/components/Container";
import { cx } from "@/lib/cx";

// A titled block on the lab page.
export function LabSection({
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
  return (
    <section
      aria-labelledby={`${id}-heading`}
      data-tone={tone === "night" ? "night" : undefined}
      className={cx("py-20 md:py-24", tone === "night" && "night-band", className)}
    >
      <Container>
        <h2 id={`${id}-heading`} className="text-h2">
          {title}
        </h2>
        {intro && (
          <p
            className={cx(
              "mt-3 max-w-[60ch] text-lead",
              tone === "light" ? "text-slate" : "text-night-muted",
            )}
          >
            {intro}
          </p>
        )}
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

// A small caption naming the thing shown above or beside it.
export function Label({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "night";
}) {
  return (
    <p className={cx("text-small", tone === "light" ? "text-muted" : "text-night-muted")}>
      {children}
    </p>
  );
}
