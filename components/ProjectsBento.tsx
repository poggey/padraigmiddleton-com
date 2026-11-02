import { ProjectTile } from "@/components/ProjectTile";
import type { Project } from "@/lib/content";
import { cx } from "@/lib/cx";

/**
 * The homepage band's grid. Each row pairs a feature card with a standard one, alternating sides,
 * so no two rows look the same. A standard card left over spans the full width with its graphic
 * on the side.
 */
export function ProjectsBento({ projects }: { projects: Project[] }) {
  const features = projects.filter((p) => p.size === "feature");
  const standards = projects.filter((p) => p.size === "standard");
  const rows: Array<{ project: Project; span: string; layout: "top" | "side" }> = [];

  features.forEach((feature, i) => {
    const partner = standards.shift();
    const featureCell = { project: feature, span: "lg:col-span-4", layout: "side" as const };
    const partnerCell = partner && {
      project: partner,
      span: "lg:col-span-2",
      layout: "top" as const,
    };
    if (!partnerCell) rows.push({ ...featureCell, span: "lg:col-span-6" });
    else if (i % 2 === 0) rows.push(featureCell, partnerCell);
    else rows.push(partnerCell, featureCell);
  });
  standards.forEach((project) =>
    rows.push({
      project,
      span: standards.length === 1 ? "lg:col-span-6" : "lg:col-span-3",
      layout: standards.length === 1 ? "side" : "top",
    }),
  );

  return (
    <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
      {rows.map(({ project, span, layout }) => (
        <li key={project.slug} className={cx(span, project.size === "feature" && "md:col-span-2")}>
          <ProjectTile project={project} layout={layout} wide={span === "lg:col-span-6"} />
        </li>
      ))}
    </ul>
  );
}
