import type { Metadata } from "next";

/** Title, description, canonical URL and social cards for one page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  ownImage = false,
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** The page has its own opengraph-image file (essays and projects). */
  ownImage?: boolean;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      // The default preview, unless the page has its own image file. Setting images here would
      // override that file.
      ...(ownImage
        ? {}
        : { images: [{ url: "/social.png", width: 1200, height: 630, alt: "Padraig Middleton" }] }),
      // Repeated from the root layout: a page's openGraph replaces the layout's whole object.
      siteName: "Padraig Middleton",
      locale: "en_GB",
      ...(title ? { title } : {}),
      description,
      url: path,
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", ...(title ? { title } : {}), description },
  };
}
