import Link from "next/link";
import type { Project } from "@/lib/content";

// Projects outside finance: still here and linked, but listed quietly rather than featured.
export function AlsoBuilt({ projects, heading = 3 }: { projects: Project[]; heading?: 2 | 3 }) {
  const Heading = heading === 2 ? "h2" : "h3";
  if (projects.length === 0) return null;
  return (
    <div className="mt-16">
      <Heading className="text-ui font-semibold text-night-text">Also built</Heading>
      <ul className="mt-4 grid border-t border-night-line lg:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="border-b border-night-line lg:odd:pr-8 lg:even:border-l lg:even:pl-8"
          >
            <Link href={`/projects/${project.slug}`} className="group block rounded-[2px] py-5">
              <span className="font-semibold text-night-text transition-colors duration-(--dur-hover) group-is-hover:text-signal-soft">
                {project.title}
              </span>
              <span className="mt-1 block max-w-[52ch] text-night-muted">{project.oneLine}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
