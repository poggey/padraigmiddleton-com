import type { Metadata } from "next";
import "./reviews.css";

// Design prototypes for Padraig to choose between. Outside the (site) group, so they have none of
// the live site's navigation, frame or footer, and kept out of search engines and the sitemap.
export const metadata: Metadata = {
  title: { default: "Design prototypes", template: "%s | Design prototypes" },
  robots: { index: false, follow: false },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
