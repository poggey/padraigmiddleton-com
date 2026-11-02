import { ViewTransition } from "react";
import { BuiltBy } from "@/components/BuiltBy";
import { Footer } from "@/components/Footer";
import { SiteNav } from "@/components/SiteNav";
import { SkipLink } from "@/components/SkipLink";
import { getSite } from "@/lib/content";

// The shell shared by every public page: skip link, navigation, the page, footer.
// Page changes cross-fade (see the view transition styles in globals.css).
export default function SiteLayout({ children }: LayoutProps<"/">) {
  const { contact, author } = getSite();
  return (
    // At least a screen tall, so the footer always sits at the bottom of short pages.
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <SiteNav contact={contact} />
      <ViewTransition>
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </ViewTransition>
      <Footer />
      <BuiltBy name={author} github={contact.github} />
    </div>
  );
}
