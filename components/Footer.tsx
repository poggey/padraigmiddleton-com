import Link from "next/link";
import { Container } from "@/components/Container";

// Small print at the end of every page, on night. Everything sits on the left: the built-by
// badge is fixed to the bottom right corner.
export function Footer() {
  return (
    <footer data-tone="night" data-nav-tone="night" className="bg-night">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-10 pb-20 text-small text-night-muted md:pb-10">
        <p>© Padraig Middleton. London and Newcastle.</p>
        <Link
          href="/rss.xml"
          className="rounded-[2px] underline-offset-4 is-hover:text-night-text is-hover:underline"
        >
          RSS
        </Link>
      </Container>
    </footer>
  );
}
