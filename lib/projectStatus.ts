import type { Project } from "@/lib/content";

const labels = { live: "Live", complete: "Complete", "in-progress": "In progress" } as const;

/** "Live, updated daily" from the status and optional note. */
export function statusText(project: Pick<Project, "status" | "statusNote">) {
  return project.statusNote
    ? `${labels[project.status]}, ${project.statusNote}`
    : labels[project.status];
}
