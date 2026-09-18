'use client';

import { Mail, MessageCircle } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@/lib/constants/contact';

interface ListingActionsProps {
  emailSubject: string;
  emailBody: string;
  whatsappMessage: string;
}

export function ListingActions({ emailSubject, emailBody, whatsappMessage }: ListingActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
        className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-lg"
        style={{ backgroundColor: 'var(--lst-accent)', color: '#1A1200' }}
      >
        <Mail size={18} />
        Email us
      </a>
      <a
        href={`https://wa.me/${CONTACT_WHATSAPP}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg border"
        style={{ borderColor: 'var(--lst-border)', color: 'var(--lst-text)' }}
      >
        <MessageCircle size={18} color="#25D366" />
        DM us
      </a>
    </div>
  );
}