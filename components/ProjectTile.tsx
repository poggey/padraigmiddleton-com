import { ProjectCard } from "@/components/ProjectCard";
import { ProjectGraphic } from "@/components/ProjectGraphic";
import type { Project } from "@/lib/content";
import { statusText } from "@/lib/projectStatus";

// A project card filled from its content file, with its own graphic.
export function ProjectTile({
  project,
  layout = "top",
  wide = false,
  className,
}: {
  project: Project;
  layout?: "top" | "side";
  /** The card spans the full width, so the graphic gets the wide drawing box. */
  wide?: boolean;
  className?: string;
}) {
  return (
    <ProjectCard
      href={`/projects/${project.slug}`}
      title={project.title}
      kind={project.kind}
      oneLine={project.oneLine}
      status={statusText(project)}
      stack={project.stack}
      keyResult={project.keyResult}
      size={project.size}
      layout={layout}
      todo={project.todo}
      className={className}
      graphic={
        wide ? (
          // The wide drawing box only on large screens; phones get the card-sized one.
          <>
            <div className="lg:hidden">
              <ProjectGraphic graphic={project.graphic} />
            </div>
            <div className="hidden lg:block">
              <ProjectGraphic graphic={project.graphic} variant="wide" />
            </div>
          </>
        ) : (
          <ProjectGraphic graphic={project.graphic} />
        )
      }
    />
  );
}
