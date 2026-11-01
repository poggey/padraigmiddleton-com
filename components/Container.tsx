import { cx } from "@/lib/cx";

// The page column: 1200px of content with 32px side padding (20px on phones).
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // Full width up to 1200px plus the gutters, so it never overflows inside flex or grid layouts.
    <div
      className={cx(
        "mx-auto w-full max-w-[calc(var(--container)+2*var(--gutter))] px-(--gutter)",
        className,
      )}
    >
      {children}
    </div>
  );
}
