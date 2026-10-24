import { Mail, MessageCircle } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@/lib/constants/contact';

interface ContactStripProps {
  /** What the visitor is contacting about, e.g. "a shipping quote". */
  subject: string;
}

/**
 * Bottom contact strip for the service pages — same email/WhatsApp button
 * pattern as ListingActions, themed for the marketing layout.
 */
export function ContactStrip({ subject }: ContactStripProps) {
  const emailSubject = encodeURIComponent(`SeaStarTrader service request: ${subject}`);
  const emailBody = encodeURIComponent(
    `Hi SeaStarTrader,\n\nI have a question about ${subject}. Could you get back to me?\n\nThank you!`
  );
  const whatsappMessage = encodeURIComponent(
    `Hi SeaStarTrader, I have a question about ${subject}.`
  );

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div
        className="rounded-lg border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up"
        style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
      >
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--navy)' }}>
            Prefer to talk first?
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            Our service team answers questions before you submit anything.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-lg btn-3d"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
          >
            <Mail size={18} />
            Email us
          </a>
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border transition-transform duration-150 active:scale-[0.97]"
            style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}
          >
            <MessageCircle size={18} color="#25D366" />
            DM us
          </a>
        </div>
      </div>
    </section>
  );
}
