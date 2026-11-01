import type { Metadata } from "next";
import { LabShell } from "./LabShell";
import { Colours } from "./_sections/Colours";
import { TypeScale } from "./_sections/TypeScale";
import { Spacing } from "./_sections/Spacing";
import { Buttons } from "./_sections/Buttons";
import { Controls } from "./_sections/Controls";
import { Surfaces } from "./_sections/Surfaces";
import { GlassAndNav } from "./_sections/GlassAndNav";
import { Writing } from "./_sections/Writing";
import { ProjectsDemo } from "./_sections/ProjectsDemo";
import { LabSection } from "./_sections/LabSection";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

// Every design primitive on one page, with real content. Not linked from the site.
export default function LabPage() {
  return (
    <LabShell>
      <main>
        <Colours />
        <TypeScale />
        <Spacing />
        <Buttons />
        <LabSection
          id="controls"
          title="Chips, toggles and tooltips"
          intro="Small controls share one shape: the pill. Indicators slide on a spring."
        >
          <Controls />
        </LabSection>
        <Surfaces />
        <GlassAndNav />
        <Writing />
        <LabSection
          id="projects"
          title="Projects"
          intro="The one dark band. Every card will hold a miniature of the project’s own output."
          tone="night"
        >
          <ProjectsDemo />
        </LabSection>
      </main>
    </LabShell>
  );
}
