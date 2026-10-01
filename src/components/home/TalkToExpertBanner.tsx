'use client';

import Link from 'next/link';
import { Phone, FileText } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function TalkToExpertBanner() {
  const { t } = useLanguage();
  return (
    <section style={{ backgroundColor: 'var(--orange)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--paper)' }}>
            {t('expert.title')}
          </h2>
          <p className="text-sm" style={{ color: 'var(--paper)' }}>
            {t('expert.subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="tel:+18005550134"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--paper)', color: 'var(--navy)' }}
          >
            <Phone size={15} /> {t('expert.call')}
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--paper)', color: 'var(--navy)' }}
          >
            <FileText size={15} /> {t('expert.contactForm')}
          </Link>
        </div>
      </div>
    </section>
  );
}