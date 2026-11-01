import Link from "next/link";

// Placeholder until the homepage is built in Phases 5 to 7.
export default function HomePage() {
  return (
    <main className="mx-auto max-w-page px-(--gutter) py-(--section-y)">
      <h1 className="text-display">Padraig Middleton</h1>
      <p className="mt-6 max-w-[60ch] text-lead text-slate">
        Essays on economics and markets, and the projects I build to test them. Economics and
        Finance at Queen Mary University of London.
      </p>
      <p className="mt-10">
        <Link href="/lab" className="font-semibold text-signal underline underline-offset-4">
          Open the design lab
        </Link>
      </p>
    </main>
  );
}
