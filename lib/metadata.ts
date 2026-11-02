import type { Metadata } from "next";

/** Title, description, canonical URL and social cards for one page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...(title ? { title } : {}),
      description,
      url: path,
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", ...(title ? { title } : {}), description },
  };
}
