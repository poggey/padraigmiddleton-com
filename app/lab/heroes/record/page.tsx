import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Nav } from "@/components/Nav";
import { RecordTimeline } from "../_parts/RecordTimeline";

export const metadata: Metadata = { title: "Hero: on the record", robots: { index: false } };

// Option 4: typography-led. The live prediction is the headline, with a gold countdown.
export default function RecordHero() {
  return (
    <main>
      <section>
        <Nav />
        <Container className="flex min-h-[44rem] flex-col justify-center py-16 lg:min-h-[calc(100svh-4rem)]">
          <p className="text-small font-semibold text-gilt-deep">On the record</p>
          <h1 className="mt-5 max-w-[20ch] text-title">
            Linkers will make up less than 9.3% of planned gilt sales in the 2027{"⁠–⁠"}28 remit.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lead text-slate">
            From No. 1,{" "}
            <Link
              href="/writing/the-bill-britain-keeps-signing"
              className="text-ink underline decoration-line-strong underline-offset-4"
            >
              The bill Britain keeps signing
            </Link>
            . Every essay ends with a dated, checkable prediction. Nothing is edited and nothing is
            deleted.
          </p>
          <RecordTimeline className="mt-14" made="2026-11-03" check="2027-04-30" />
          <div className="mt-16 flex flex-col justify-between gap-8 border-t border-line pt-8 lg:flex-row lg:items-center">
            <p className="max-w-[48ch] text-slate">
              <span className="font-semibold text-ink">Padraig Middleton.</span> Second-year
              Economics and Finance student at Queen Mary University of London. Looking for Summer
              2027 internships.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/writing/the-bill-britain-keeps-signing">Read the essay</Button>
              <Button variant="secondary" href="/ledger">
                See the Ledger
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
