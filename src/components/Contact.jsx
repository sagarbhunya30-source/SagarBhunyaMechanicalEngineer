import { mailtoHref, profile, telHref } from '../data/profile.js';
import ContactActions from './ContactActions.jsx';
import { MailIcon, PhoneIcon, PinIcon } from './Icons.jsx';
import SectionHeading from './SectionHeading.jsx';

export function ContactDetails({ compact = false }) {
  const rows = [
    { icon: MailIcon, label: 'Email', value: profile.contact.email, href: mailtoHref },
    { icon: PhoneIcon, label: 'Phone', value: profile.contact.phoneDisplay, href: telHref },
    { icon: PinIcon, label: 'Location', value: profile.location },
  ];
  return (
    <dl className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
      {rows.map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex items-start gap-3 rounded-lg border border-white/10 bg-graphite-900/60 p-4">
          <Icon className="mt-0.5 shrink-0 text-amber-300" />
          <div className="min-w-0">
            <dt className="engraved">{label}</dt>
            <dd className="mt-1 break-words text-paper">
              {href ? (
                <a href={href} className="underline decoration-white/20 underline-offset-4 hover:text-amber-300 hover:decoration-amber-300">
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-b border-white/10">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading id="contact-title" index="06" label="Contact" title="Contact Sagar">
          Open to entry-level roles in mechanical engineering, quality inspection, production, and manufacturing.
        </SectionHeading>
        <div className="panel mt-10 p-5 sm:p-8">
          <ContactDetails />
          <div className="mt-6">
            <ContactActions />
          </div>
        </div>
      </div>
    </section>
  );
}
