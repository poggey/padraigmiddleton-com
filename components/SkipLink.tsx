// The first thing a keyboard user reaches: jumps past the navigation to the page content.
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only fixed top-3 left-3 z-[60] rounded-control bg-paper px-5 py-3 text-ui font-medium text-ink shadow-e3 focus:not-sr-only"
    >
      Skip to content
    </a>
  );
}
