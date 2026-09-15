import Link from 'next/link';
import { Phone, FileText } from 'lucide-react';

export function TalkToExpertBanner() {
  return (
    <section style={{ backgroundColor: 'var(--orange)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-1">
            Have questions about buying or selling?
          </h2>
          <p className="text-white/90 text-sm">Our team is ready to help — by phone or message.</p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="tel:+18005550134"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm border border-white text-white hover:bg-white/10 transition-colors"
          >
            <Phone size={15} /> Call +1 (800) 555-0134
          </a>
          <Link
            href="/contact"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-sm border border-white text-white hover:bg-white/10 transition-colors"
          >
            <FileText size={15} /> Contact Form
          </Link>
        </div>
      </div>
    </section>
  );
}