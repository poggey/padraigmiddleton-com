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
    <div className={cx("mx-auto max-w-page px-(--gutter) box-content", className)}>{children}</div>
  );
}
