import Script from "next/script";

/**
 * Padraig's "Built by" badge (github.com/poggey/built-by), the same one on all his projects.
 * Served from public/built-by.js, a copy of the repo's script: update the copy if the badge
 * changes. Loaded after everything else so it never slows the page.
 */
export function BuiltBy({ name, github }: { name: string; github: string }) {
  return <Script src="/built-by.js" strategy="lazyOnload" data-name={name} data-github={github} />;
}
