import Link from "next/link";
import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";

// Small print at the end of every page, on night.
export function Footer({ github }: { github: string }) {
  return (
    <footer data-tone="night" data-nav-tone="night" className="bg-night">
      <Container className="flex flex-col gap-4 py-10 text-small text-night-muted md:flex-row md:items-center md:justify-between">
        <p>© Padraig Middleton. London and Newcastle.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/rss.xml"
            className="rounded-[2px] underline-offset-4 is-hover:text-night-text is-hover:underline"
          >
            RSS
          </Link>
          <ExternalLink href={github} tone="night">
            Designed and built by Padraig
          </ExternalLink>
        </div>
      </Container>
    </footer>
  );
}
