import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaqAccordion } from './FaqAccordion';
import { ContactStrip } from './ContactStrip';
import { RequestFormSection } from './RequestFormSection';
import type { ServicePageContent } from '@/lib/constants/service-content';

interface ServicePageBaseProps {
  content: ServicePageContent;
  icon: ReactNode;
  /** The service-specific form, already gated by RequestFormSection. */
  form: ReactNode;
  signedIn: boolean;
  requestPath: string;
  /** Optional service-specific section between the info cards and FAQ,
   *  e.g. the inspection report checklist or refurbishing before/after. */
  specialSection?: ReactNode;
}

/** Shared skeleton for all four service pages. */
export function ServicePageBase({
  content,
  icon,
  form,
  signedIn,
  requestPath,
  specialSection,
}: ServicePageBaseProps) {
  return (
    <>
      {/* 1 — Hero (full-bleed photo per service, dark overlay for readability) */}
      <section className="relative overflow-hidden">
        {content.heroImage && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content.heroImage})` }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(10, 21, 32, 0.82) 0%, rgba(10, 21, 32, 0.86) 60%, var(--paper) 100%)',
              }}
            />
          </>
        )}
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-start gap-5 mb-6 animate-fade-in-up">
          <span
            className="p-3 rounded-lg shrink-0 mt-1"
            style={{ backgroundColor: 'rgba(245, 179, 36, 0.15)' }}
          >
            {icon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
              Sea Star Trader Services
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight" style={{ color: 'var(--navy)' }}>
              {content.keyword}
            </h1>
          </div>
        </div>
        <p className="text-lg sm:text-xl max-w-3xl mb-8 animate-fade-in-up" style={{ color: 'var(--slate)' }}>
          {content.tagline}
        </p>
        <Link
          href="#request-form"
          className="inline-block px-6 py-3 text-sm font-bold rounded-lg btn-3d"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
        >
          {content.heroCta}
        </Link>
        </div>
      </section>

      {/* 2 — How it works */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--navy)' }}>
          How it works
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--slate)' }}>
          From first contact to delivery, a process you can follow.
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.steps.map((step, index) => (
            <li
              key={step.title}
              className="card-tilt rounded-lg border p-6 relative"
              style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold mb-4"
                style={{ backgroundColor: 'var(--orange)', color: 'var(--navy-solid)' }}
              >
                {index + 1}
              </span>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--navy)' }}>
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--slate)' }}>
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 3 — What's included cards */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
          What&rsquo;s included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {content.infoCards.map((card) => (
            <div
              key={card.title}
              className="card-tilt p-6 rounded-lg border"
              style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
            >
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--navy)' }}>
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--slate)' }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
        {content.infoNote && (
          <div className="glass-card backdrop-blur-md rounded-lg p-6 mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
              {content.infoNote.title}
            </h3>
            <ul className="space-y-2">
              {content.infoNote.items.map((item) => (
                <li key={item} className="text-sm flex gap-2" style={{ color: 'var(--ink)' }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--orange)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Service-specific section */}
      {specialSection}

      {/* 4 — FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-extrabold mb-8" style={{ color: 'var(--navy)' }}>
          Frequently asked questions
        </h2>
        <FaqAccordion items={content.faq} />
      </section>

      {/* 5 — Request form (gated) */}
      <RequestFormSection
        requestPath={requestPath}
        serviceTitle={content.subject}
        signedIn={signedIn}
      >
        {form}
      </RequestFormSection>

      {/* 6 — Contact strip */}
      <ContactStrip subject={content.subject} />
    </>
  );
}
