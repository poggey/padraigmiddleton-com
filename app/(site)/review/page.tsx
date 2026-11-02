import { Container } from "@/components/Container";
import { HeadroomSlider } from "@/components/essay/HeadroomSlider";
import { WritingSection } from "@/components/home/WritingSection";
import { AlsoBuilt } from "@/components/projects/AlsoBuilt";
import { projectItems } from "@/components/projects/items";
import { ProjectCards } from "@/components/projects/ProjectCards";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { getPosts, getProjects, getSite } from "@/lib/content";

// Temporary: the design options for Padraig to choose between. Delete once he has decided.
export const metadata = { title: "Design options", robots: { index: false, follow: false } };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pt-16">
      <p className="inline-block rounded-inline bg-gilt/15 px-3 py-1.5 text-small font-semibold text-ink">
        {children}
      </p>
    </Container>
  );
}

export default function ReviewPage() {
  const site = getSite();
  const posts = getPosts();
  const projects = getProjects();
  const featured = projectItems(projects.filter((p) => p.featured));
  const night = (children: React.ReactNode) => (
    <section
      data-tone="night"
      data-nav-tone="night"
      className="night-band border-t border-frame py-16"
    >
      <Container>
        {children}
        <AlsoBuilt projects={projects.filter((p) => !p.featured)} />
      </Container>
    </section>
  );

  return (
    <div className="pt-16">
      <Container className="pt-16">
        <h1 className="text-title">Design options</h1>
        <p className="mt-4 max-w-[60ch] text-lead text-slate">
          Each choice shows option 1 (on the site now) and option 2. Tell me which you prefer.
        </p>
      </Container>

      <Label>1. Writing, option 1: the essay’s first page (on the homepage now)</Label>
      <WritingSection posts={posts} copy={site.sections.writing} variant="page" />
      <Label>1. Writing, option 2: editorial teaser with the chart</Label>
      <WritingSection posts={posts} copy={site.sections.writing} variant="teaser" />

      <Label>2. Projects, option 1: index with a preview (on the site now)</Label>
      {night(<ProjectIndex items={featured} />)}
      <Label>2. Projects, option 2: even cards</Label>
      {night(<ProjectCards items={featured} />)}

      <Label>3. Essay slider, option 1: a sentence you can move (in the essay now)</Label>
      <Container>
        <div className="mx-auto max-w-essay">
          <HeadroomSlider variant="sentence" />
        </div>
      </Container>
      <Label>3. Essay slider, option 2: two bars</Label>
      <Container className="pb-24">
        <div className="mx-auto max-w-essay">
          <HeadroomSlider variant="bars" />
        </div>
      </Container>
    </div>
  );
}
