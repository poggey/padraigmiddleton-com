import { Card } from "@/components/Card";
import { LabSection, Label } from "./LabSection";

const elevations = [
  { level: "e0", job: "Flat surfaces on the ground" },
  { level: "e1", job: "Resting cards" },
  { level: "e2", job: "Hovered or raised cards" },
  { level: "e3", job: "Floating: hero cards, menus" },
] as const;

const radii = [
  { radius: "inline", px: 12, job: "Inputs, tooltips, sidenotes" },
  { radius: "card", px: 20, job: "Essay previews, experience panel" },
  { radius: "feature", px: 28, job: "Large project tiles" },
  { radius: "panel", px: 36, job: "Footer contact panel" },
] as const;

export function Surfaces() {
  return (
    <LabSection
      id="surfaces"
      title="Surfaces"
      intro="Depth from height, not decoration. Shadows are tinted navy. Each job gets its own radius, so the page never looks like a kit of identical cards."
    >
      <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {elevations.map(({ level, job }) => (
          <li key={level}>
            <Card elevation={level} className="flex h-36 items-end p-5">
              <div>
                <p className="text-small font-semibold">{level}</p>
                <Label>{job}</Label>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <ul className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {radii.map(({ radius, px, job }) => (
          <li key={radius}>
            <Card elevation="e1" radius={radius} className="flex h-36 items-end p-5">
              <div>
                <p className="text-small font-semibold">
                  {radius}, {px}px
                </p>
                <Label>{job}</Label>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </LabSection>
  );
}
