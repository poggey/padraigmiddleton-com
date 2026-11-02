import { getSite } from "@/lib/content";
import { ogImage } from "@/lib/og";
import { siteUrl } from "@/lib/site";

// The default LinkedIn preview (the homepage and every page without its own): the name and the
// hero headline. Served at a fixed address so lib/metadata.ts can point every page at it.
export function GET() {
  const site = getSite();
  return ogImage({
    label: site.author,
    title: site.hero.headline,
    titleSize: 64,
    domain: new URL(siteUrl).host,
  });
}
