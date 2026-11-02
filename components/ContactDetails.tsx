import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export type ContactCopy = { heading: string; line: string };
export type Contact = { email: string; linkedin: string; github: string; cv: string };

// The invitation to get in touch, on night: a line, the email address large, and the links.
export function ContactDetails({ copy, contact }: { copy: ContactCopy; contact: Contact }) {
  return (
    <Container className="py-(--section-y)">
      <h2 id="contact-heading" className="text-h2 text-night-text">
        {copy.heading}
      </h2>
      <p className="mt-4 max-w-[44ch] text-lead text-night-muted">{copy.line}</p>
      <p className="mt-10">
        <a
          href={`mailto:${contact.email}`}
          className="rounded-[4px] text-h3 text-night-text underline decoration-signal-soft/40 decoration-2 underline-offset-[10px] transition-[text-decoration-color] duration-(--dur-hover) ease-out is-hover:decoration-signal-soft md:text-h2"
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
  );
}
