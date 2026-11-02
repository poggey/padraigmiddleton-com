import type { MDXComponents } from "mdx/types";
import { Todo } from "@/components/Todo";

// How a project write-up's Markdown is styled on its case study page.
export const projectComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-12 text-h3 first:mt-0" {...props} />,
  p: (props) => <p className="mt-4 text-lead text-slate" {...props} />,
  ol: (props) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-6 text-lead text-slate marker:font-sans marker:text-muted"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-6 text-lead text-slate marker:text-muted"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  code: (props) => <code className="text-[0.88em]" {...props} />,
  a: (props) => (
    <a
      className="text-signal underline decoration-signal/35 underline-offset-4 hover:decoration-signal"
      {...props}
    />
  ),
  Todo,
};
