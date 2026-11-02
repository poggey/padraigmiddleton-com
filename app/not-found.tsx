import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { BuiltBy } from "@/components/BuiltBy";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { SkipLink } from "@/components/SkipLink";
import { getPosts, getSite } from "@/lib/content";

export const metadata = { title: "Page not found" };

// Short and useful: the latest essay (most links in are to essays), then where else to go.
export default function NotFound() {
  const { contact, author } = getSite();
  const [latest] = getPosts();
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteNav contact={contact} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Container className="min-h-[70svh] pt-40 pb-(--section-y)">
          <p className="text-small text-muted">Page not found</p>
          <h1 className="mt-3 text-title">This page doesn’t exist.</h1>
          <p className="mt-6 max-w-[52ch] text-lead text-slate">
            If you followed a link to an essay, it may be this one:{" "}
            <Link
              href={`/writing/${latest.slug}`}
              className="rounded-[2px] text-signal underline decoration-signal/35 underline-offset-4 is-hover:decoration-signal"
            >
              {latest.title}
            </Link>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/writing">Read the writing</Button>
            <Button href="/projects" variant="secondary">
              See the projects
            </Button>
            <Button href="/" variant="ghost">
              Go to the homepage
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
      <BuiltBy name={author} github={contact.github} />
    </div>
  );
}
