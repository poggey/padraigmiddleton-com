import { Button } from "@/components/Button";

// Who wrote it, in one line, with the two places a reader might go next.
export function AuthorCard({ line, cv }: { line: string; cv: string }) {
  return (
    <aside
      aria-label="About the author"
      className="mt-16 rounded-card bg-paper px-6 py-6 shadow-e1 md:flex md:items-center md:justify-between md:gap-8 md:px-8"
    >
      <div>
        <p className="font-semibold">Padraig Middleton</p>
        <p className="mt-1 text-slate">{line}</p>
      </div>
      <div className="mt-5 flex shrink-0 gap-2 md:mt-0">
        <Button href="/about" variant="secondary" size="sm">
          About me
        </Button>
        <Button href={cv} size="sm">
          Download CV
        </Button>
      </div>
    </aside>
  );
}
