import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Everything is open to search engines except the design lab.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/lab" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
