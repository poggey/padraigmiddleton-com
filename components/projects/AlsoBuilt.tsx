import Link from "next/link";
import type { Project } from "@/lib/content";

// Projects outside finance: still here and linked, but listed quietly rather than featured.
export function AlsoBuilt({ projects, heading = 3 }: { projects: Project[]; heading?: 2 | 3 }) {
  const Heading = heading === 2 ? "h2" : "h3";
  if (projects.length === 0) return null;
  return (
    <div className="mt-16 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      <Heading className="text-ui font-semibold text-night-text">Also built</Heading>
      <ul className="border-t border-night-line">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-night-line">
            <Link
              href={`/projects/${project.slug}`}
              className="group grid gap-1 rounded-[2px] py-4 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-6"
            >
              <span className="font-semibold text-night-text group-is-hover:text-signal-soft">
                {project.title}
              </span>
              <span className="text-night-muted">{project.oneLine}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
