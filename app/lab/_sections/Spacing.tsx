import { LabSection, Label } from "./LabSection";

const steps = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160];

export function Spacing() {
  return (
    <LabSection id="spacing" title="Spacing" intro="A 4px base. Tailwind's p-6 is 24px.">
      <ul className="space-y-3">
        {steps.map((px) => (
          <li key={px} className="grid grid-cols-[4rem_1fr] items-center gap-4">
            <Label>
              <span className="tabular-nums">{px}px</span>
            </Label>
            <div className="h-3 rounded-pill bg-signal" style={{ width: px }} />
          </li>
        ))}
      </ul>
    </LabSection>
  );
}
