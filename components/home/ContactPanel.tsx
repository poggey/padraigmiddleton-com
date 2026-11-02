import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Torch } from "@/components/Torch";

/**
 * The end of the homepage: night, running straight into the footer. Behind it, nearly invisible,
 * is the latest essay; a soft light that follows the cursor (or drifts on its own) reveals it.
 */
export function ContactPanel({
  copy,
  contact,
  essay,
}: {
  copy: { heading: string; line: string };
  contact: { email: string; linkedin: string; github: string; cv: string };
  essay: string[];
}) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-tone="night"
      data-nav-tone="night"
      className="bg-night"
    >
      <Torch paragraphs={essay} quiet>
        <Container className="py-(--section-y)">
          <h2 id="contact-heading" className="text-h2 text-night-text">
            {copy.heading}
          </h2>
          <p className="mt-4 max-w-[44ch] text-lead text-night-muted">{copy.line}</p>
          <p className="mt-10">
            <a
              href={`mailto:${contact.email}`}
              className="rounded-[4px] text-h3 text-night-text md:text-h2 underline decoration-signal-soft/40 decoration-2 underline-offset-[10px] transition-[text-decoration-color] duration-(--dur-hover) ease-out is-hover:decoration-signal-soft"
            >
              {/* Wraps only at the @ on narrow screens. */}
              {contact.email.split("@")[0]}@<wbr />
              {contact.email.split("@")[1]}
            </a>
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button tone="night" variant="secondary" href={contact.linkedin} external>
              LinkedIn
            </Button>
            <Button tone="night" variant="secondary" href={contact.github} external>
              GitHub
            </Button>
            <Button tone="night" href={contact.cv}>
              Download CV
            </Button>
          </div>
        </Container>
      </Torch>
    </section>
  );
}
