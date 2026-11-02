import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import type { Experience } from "@/lib/content/schemas";
import { ExperienceTabs } from "./ExperienceTabs";

// Roles beside their detail, then education on the same grid, ruled off rather than boxed.
export function ExperienceSection({
  experience,
  copy,
}: {
  experience: Experience;
  copy: { heading: string; button: string };
}) {
  const [university, ...schools] = experience.education;
  return (
    <Section id="experience" title={copy.heading}>
      <div className="mt-12">
        <ExperienceTabs roles={experience.roles} />
      </div>
      <div className="mt-16 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-0">
        <div className="lg:pr-10">
          <h3 className="text-h3">Education</h3>
          <p className="mt-4 font-semibold">{university.institution}</p>
          <p className="mt-1 text-slate">
            {university.qualification}, {university.dates}.
          </p>
          <Button href="/cv.pdf" className="mt-6">
            {copy.button}
          </Button>
        </div>
        <div className="space-y-8 lg:border-l lg:border-line lg:pl-12">
          <ul className="space-y-2">
            {university.points.map((point) => (
              <li key={point} className="relative max-w-[62ch] pl-5">
                <span
                  aria-hidden
                  className="absolute top-[0.7em] left-0 h-px w-2.5 bg-line-strong"
                />
                {point}
              </li>
            ))}
          </ul>
          {schools.map((school) => (
            <div key={school.id}>
              <p className="font-semibold">
                {school.institution}, <span className="font-normal text-slate">{school.dates}</span>
              </p>
              <ul className="mt-2 space-y-1 text-slate">
                {school.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
