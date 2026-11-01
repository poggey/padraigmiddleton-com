import { cx } from "@/lib/cx";

// One of the few big numbers on the site, with what it means underneath.
export function Stat({
  figure,
  label,
  className,
}: {
  figure: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-stat">{figure}</p>
      <p className={cx("mt-2 max-w-[28ch] text-small text-slate")}>{label}</p>
    </div>
  );
}
