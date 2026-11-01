import type { Metadata } from "next";
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { getSite } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Interface, headlines and numbers.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

// Long-form reading only. The optical size axis adjusts letterforms to the text size.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${site.title}` },
  description: site.description,
  authors: [{ name: site.author }],
  openGraph: { siteName: site.title, locale: "en_GB", type: "website" },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${schibsted.variable} ${sourceSerif.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
