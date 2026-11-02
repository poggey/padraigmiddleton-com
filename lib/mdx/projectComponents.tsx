import type { MDXComponents } from "mdx/types";
import { Todo } from "@/components/Todo";

// How a project write-up's Markdown is styled on its case study page.
export const projectComponents: MDXComponents = {
  h2: (props) => <h2 className="mt-12 text-h3 first:mt-0" {...props} />,
  p: (props) => <p className="mt-4 text-lead text-slate" {...props} />,
  a: (props) => (
    <a
      className="text-signal underline decoration-signal/35 underline-offset-4 hover:decoration-signal"
      {...props}
    />
  ),
  Todo,
};
