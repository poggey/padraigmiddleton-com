import Link from "next/link";
import { Container } from "@/components/Container";

// Small print at the end of every page, on night. Everything sits on the left: the built-by
// badge is fixed to the bottom right corner.
export function Footer() {
  return (
    <footer data-tone="night" data-nav-tone="night" className="border-t border-night-line bg-night">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-8 pb-20 text-small text-night-muted md:pb-8">
        <p>© Padraig Middleton. London and Newcastle.</p>
        <Link
          href="/rss.xml"
          className="inline-flex min-h-11 items-center rounded-[2px] underline-offset-4 is-hover:text-night-text is-hover:underline"
        >
          RSS
        </Link>
      </Container>
    </footer>
  );
}
