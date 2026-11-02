import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Everything is open to search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/review" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
