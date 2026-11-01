import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({
  title: "About",
  description: "Padraig Middleton, Economics and Finance at Queen Mary University of London.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="pt-32 pb-(--section-y)">
      <h1 className="text-title">About</h1>
      <p className="mt-6 max-w-[60ch] text-lead text-slate">{site.about.bio}</p>
      <Stub phase={9} />
    </Container>
  );
}
