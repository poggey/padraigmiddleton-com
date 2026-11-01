import { Button } from "@/components/Button";
import { ExternalLink } from "@/components/ExternalLink";
import { LabSection, Label } from "./LabSection";

const states = [
  { label: "Default", force: undefined, disabled: false },
  { label: "Hover", force: "hover", disabled: false },
  { label: "Focus", force: "focus", disabled: false },
  { label: "Pressed", force: "active", disabled: false },
  { label: "Disabled", force: undefined, disabled: true },
];

const variants = [
  { variant: "primary", text: "Read the latest essay" },
  { variant: "secondary", text: "See the projects" },
  { variant: "ghost", text: "View all projects" },
] as const;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-line py-8 lg:grid-cols-[200px_1fr]">
      <p className="text-small text-ink">{title}</p>
      <div className="flex flex-wrap gap-x-6 gap-y-6">{children}</div>
    </div>
  );
}

export function Buttons() {
  return (
    <LabSection
      id="buttons"
      title="Buttons and links"
      intro="Buttons say exactly what happens. Hover lifts by 1px, pressing scales to 98%. Only links to other sites get an arrow."
    >
      {variants.map(({ variant, text }) => (
        <Row key={variant} title={variant[0].toUpperCase() + variant.slice(1)}>
          {states.map((state) => (
            <div key={state.label} className="space-y-3">
              <Button variant={variant} force={state.force} disabled={state.disabled}>
                {text}
              </Button>
              <Label>{state.label}</Label>
            </div>
          ))}
        </Row>
      ))}
      <Row title="External link">
        {states.slice(0, 3).map((state) => (
          <div key={state.label} className="space-y-3">
            <p className="flex h-11 items-center">
              <ExternalLink href="https://github.com/poggey" force={state.force}>
                View on GitHub
              </ExternalLink>
            </p>
            <Label>{state.label}</Label>
          </div>
        ))}
      </Row>
    </LabSection>
  );
}
