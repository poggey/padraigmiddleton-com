import { Button } from "@/components/Button";
import { ContactDetails } from "@/components/ContactDetails";
import { Container } from "@/components/Container";
import { Todo } from "@/components/Todo";
import { getExperience, getSite } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const site = getSite();
export const metadata = pageMetadata({
  title: "About",
  description: "Padraig Middleton, Economics and Finance at Queen Mary University of London.",
  path: "/about",
});

// The note in a "TODO(Padraig): …" string, or undefined once Padraig has written the real text.
const todo = (text: string) => text.match(/^TODO\(Padraig\):\s*(.*)$/)?.[1];

// The longer version: bio, every role in full, education, skills, life outside work, contact.
export default function AboutPage() {
  const { roles, education } = getExperience();
  const { about, contact } = site;
  return (
    <>
      <Container className="pt-32 pb-(--section-y)">
        <h1 className="text-title">About</h1>
        <p className="mt-6 max-w-[60ch] text-lead text-slate">{about.bio}</p>
        {todo(about.ownWords) ? (
          <div className="max-w-[60ch]">
            <Todo>{todo(about.ownWords)}</Todo>
          </div>
        ) : (
          <p className="mt-6 max-w-[60ch] text-lead text-slate">{about.ownWords}</p>
        )}
        {todo(about.headshot) && (
          <div className="max-w-[60ch]">
            <Todo>{todo(about.headshot)}</Todo>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={contact.cv}>Download CV</Button>
          <Button href={contact.linkedin} variant="secondary" external>
            LinkedIn
          </Button>
        </div>

        <AboutSection title="Experience">
          {roles.map((role) => (
            <Entry
              key={role.id}
              title={role.organisation}
              detail={`${role.role}, ${role.location}`}
              dates={role.dates}
              points={role.bullets}
            />
          ))}
        </AboutSection>

        <AboutSection title="Education">
          {education.map((school) => (
            <Entry
              key={school.id}
              title={school.institution}
              detail={school.qualification}
              dates={school.dates}
              points={school.points}
            />
          ))}
        </AboutSection>

        <AboutSection title="Skills">
          <dl className="space-y-5">
            {site.skills.map((skill) => (
              <div
                key={skill.label}
                className="md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6"
              >
                <dt className="font-semibold">{skill.label}</dt>
                <dd className="mt-1 max-w-[62ch] text-slate md:mt-0">{skill.items}</dd>
              </div>
            ))}
          </dl>
        </AboutSection>

        <AboutSection title="Beyond work">
          <Points points={site.beyondWork} />
        </AboutSection>
      </Container>

      <section
        aria-labelledby="contact-heading"
        data-tone="night"
        data-nav-tone="night"
        className="bg-night"
      >
        <ContactDetails copy={site.sections.contact} contact={contact} />
      </section>
    </>
  );
}

// A section with its heading in a narrow left column on wide screens.
function AboutSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 grid gap-8 border-t border-line pt-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <h2 className="text-h3">{title}</h2>
      <div className="space-y-10">{children}</div>
    </section>
  );
}

function Entry({
  title,
  detail,
  dates,
  points,
}: {
  title: string;
  detail?: string;
  dates: string;
  points: string[];
}) {
  return (
    <div>
      <h3 className="text-lead font-semibold">{title}</h3>
      <p className="mt-1 text-slate">
        {detail && <>{detail}. </>}
        <span className="text-muted">{dates}</span>
      </p>
      <Points points={points} className="mt-4" />
    </div>
  );
}

function Points({ points, className }: { points: string[]; className?: string }) {
  return (
    <ul className={`space-y-2 ${className ?? ""}`}>
      {points.map((point) => (
        <li key={point} className="relative max-w-[62ch] pl-5">
          <span aria-hidden className="absolute top-[0.75em] left-0 h-px w-2.5 bg-line-strong" />
          {point.split(/(TODO\(Padraig\):.*)$/).map((part) =>
            part.startsWith("TODO(Padraig)") ? (
              <mark
                key={part}
                className="block mt-1 rounded-inline bg-gilt/10 px-2 py-1 text-small text-ink"
              >
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </li>
      ))}
    </ul>
  );
}
