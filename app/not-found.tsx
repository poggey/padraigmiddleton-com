import Link from "next/link";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { SkipLink } from "@/components/SkipLink";
import { getSite } from "@/lib/content";

export const metadata = { title: "Page not found" };

// Short and useful: where to go instead. Polished in Phase 9.
export default function NotFound() {
  const { contact } = getSite();
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteNav contact={contact} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Container className="min-h-[70svh] pt-40 pb-(--section-y)">
          <h1 className="text-title">This page doesn’t exist.</h1>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-lead">
            <li>
              <Link href="/writing" className="text-signal underline underline-offset-4">
                Read the writing
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-signal underline underline-offset-4">
                See the projects
              </Link>
            </li>
            <li>
              <Link href="/" className="text-signal underline underline-offset-4">
                Go to the homepage
              </Link>
            </li>
          </ul>
        </Container>
      </main>
      <Footer github={contact.github} />
    </div>
  );
}
