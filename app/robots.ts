import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Written to a file at build time, because the site is a static export.
export const dynamic = "force-static";

// Everything is open to search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
