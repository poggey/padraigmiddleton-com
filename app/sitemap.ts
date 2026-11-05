import type { MetadataRoute } from "next";
import { validateContent } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Written to a file at build time, because the site is a static export.
export const dynamic = "force-static";

// Every public page. Building it validates all content, so a broken file fails the build.
export default function sitemap(): MetadataRoute.Sitemap {
  const { posts, projects } = validateContent();
  const published = posts.filter((p) => !p.draft);
  const pages = ["", "/writing", "/projects", "/about"];

  return [
    ...pages.map((page) => ({ url: `${siteUrl}${page}/` })),
    ...published.map((post) => ({
      url: `${siteUrl}/writing/${post.slug}/`,
      lastModified: post.date,
    })),
    ...projects.map((project) => ({ url: `${siteUrl}/projects/${project.slug}/` })),
  ];
}
