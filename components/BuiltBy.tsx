/**
 * Padraig's "Built by" badge (github.com/poggey/built-by), the same one on all his projects.
 * Served from public/built-by.js, a copy of the repo's script: update the copy if the badge
 * changes. A plain deferred script: it runs after the page has been parsed, never blocks it,
 * and needs no loader code from Next.js.
 */
export function BuiltBy({ name, github }: { name: string; github: string }) {
  return <script src="/built-by.js" defer data-name={name} data-github={github} />;
}
