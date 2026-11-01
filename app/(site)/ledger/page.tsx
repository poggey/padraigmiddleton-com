import { Container } from "@/components/Container";
import { Stub } from "@/components/Stub";
import { getPredictions, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const { ledger } = getSite().sections;
export const metadata = pageMetadata({
  title: ledger.heading,
  description: ledger.copy,
  path: "/ledger",
});

export default function LedgerPage() {
  return (
    <Container className="pt-32 pb-(--section-y)">
      <h1 className="text-title">{ledger.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-lead text-slate">{ledger.copy}</p>
      <ul className="mt-12 space-y-4">
        {getPredictions().map((p) => (
          <li key={p.id} className="max-w-[60ch] text-lead">
            {p.claim}
          </li>
        ))}
      </ul>
      <Stub phase={9} />
    </Container>
  );
}
