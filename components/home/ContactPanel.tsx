import { ContactDetails, type Contact, type ContactCopy } from "@/components/ContactDetails";
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
  copy: ContactCopy;
  contact: Contact;
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
        <ContactDetails copy={copy} contact={contact} />
      </Torch>
    </section>
  );
}
