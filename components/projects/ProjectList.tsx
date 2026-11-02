import Link from "next/link";
import { Chevron } from "@/components/Button";
import { ProjectEmblem } from "@/components/ProjectEmblem";
import type { Project } from "@/lib/content";

/**
 * The featured projects as a ruled two-column index. Each has a small emblem of the idea behind
 * it, which moves when the project is pointed at or focused; the charts live on the case studies.
 */
export function ProjectList({ projects, heading = 3 }: { projects: Project[]; heading?: 2 | 3 }) {
  const Heading = heading === 2 ? "h2" : "h3";
  return (
    <ul className="grid border-t border-night-line lg:grid-cols-2">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="border-b border-night-line lg:odd:pr-8 lg:even:border-l lg:even:pl-8"
        >
          <Link
            href={`/projects/${project.slug}`}
            data-emblem-host
            className="group flex gap-5 rounded-[2px] py-8 md:gap-6"
          >
            <ProjectEmblem slug={project.slug} />
            <span className="min-w-0">
              <span className="block text-small text-night-muted">{project.kind}</span>
              <Heading className="mt-1 text-h3 text-night-text transition-colors duration-(--dur-hover) group-is-hover:text-signal-soft">
                {project.title}
                <span className="ml-2 inline-block align-middle transition-transform duration-(--dur-hover) ease-out group-is-hover:translate-x-1">
                  <Chevron />
                </span>
              </Heading>
              <span className="mt-2 block max-w-[46ch] text-night-muted">{project.oneLine}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
