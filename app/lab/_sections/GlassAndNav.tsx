import { GlassPanel } from "@/components/GlassPanel";
import { Nav } from "@/components/Nav";
import { LabSection, Label } from "./LabSection";

// Real essay text as the busy background, so the blur has something to work on.
const paragraphs = [
  "Index-linked gilts, or linkers, are bonds whose coupon and principal both rise with RPI (the Retail Prices Index, one measure of inflation). It’s in their name: linkers tie both the interest payments and the maturity payment directly to inflation.",
  "Debt interest has risen from £39bn in 2019–20 to £109bn in 2025–26, and it’s now forecast to reach £160bn by 2031–32. As a share of GDP, that’s a rise from 1.7% to 4.2%, back to its 2022–23 peak.",
  "In 1981, when linkers were first introduced, they made a lot of sense. Investors lending long-term to the government demanded a large premium in case ministers inflated that debt away. Linkers removed that risk, allowing the Treasury to borrow at a lower real rate.",
  "However, in 2026 those buyers are fading. Most defined-benefit pension schemes have closed, moved into surplus or been bought out by insurers. Now the marginal buyer has alternatives and demands a fairer price.",
];

export function GlassAndNav() {
  return (
    <LabSection
      id="glass"
      title="Glass and navigation"
      intro="Glass in four places only: the nav bar, the hero's floating cards, chips over graphics and the command menu. The nav is transparent at the top and turns to glass after 8px of scroll."
    >
      <Label>At the top of the page</Label>
      <div className="-mx-(--gutter) mt-3 overflow-hidden bg-porcelain shadow-e0 md:mx-0 md:rounded-card">
        <Nav />
      </div>

      <div className="mt-10">
        <Label>After scrolling, over an essay, with Writing as the current page</Label>
      </div>
      <div className="relative -mx-(--gutter) mt-3 h-[30rem] overflow-hidden bg-paper shadow-e0 md:mx-0 md:rounded-card">
        <div
          aria-hidden
          className="space-y-5 px-(--gutter) pt-10 font-serif text-essay-body text-ink"
        >
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="absolute inset-x-0 top-0">
          <Nav scrolled current="/writing" />
        </div>
        <GlassPanel className="absolute right-4 bottom-6 w-[18rem] p-5 md:right-16 md:bottom-14">
          <p className="text-small font-semibold text-gilt-deep">On the record</p>
          <p className="mt-2 text-ui font-medium">
            Linkers will make up less than 9.3% of planned gilt sales in the 2027{"\u2060–\u2060"}28
            remit.
          </p>
          <p className="mt-3 text-small text-muted">Open. Checked 30 April 2027.</p>
        </GlassPanel>
      </div>
    </LabSection>
  );
}
