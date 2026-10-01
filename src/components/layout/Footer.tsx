'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t('footer.thanksSubscribing'));
      setEmail('');
    } catch (error) {
      toast.error(t('footer.failedSubscribe'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-xl font-extrabold mb-3" style={{ color: 'var(--ink)' }}>
              Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
            </div>
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
              {t('footer.marketplace')}
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.browseEquipment')}</Link></li>
              <li><Link href="/auctions" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.auctions')}</Link></li>
              <li><Link href="/sell" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.sellEquipment')}</Link></li>
              <li><Link href="/map" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.equipmentMap')}</Link></li>
              <li><Link href="/how-it-works" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.howItWorks')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
              {t('footer.services')}
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.allServices')}</Link></li>
              <li><Link href="/services/shipping-logistics" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.shippingLogistics')}</Link></li>
              <li><Link href="/financing" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.financing')}</Link></li>
              <li><Link href="/services/inspection-certification" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.inspection')}</Link></li>
              <li><Link href="/services/insurance" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.insurance')}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
              {t('footer.company')}
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/careers" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.careers')}</Link></li>
              <li><Link href="/press" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.pressMedia')}</Link></li>
              <li><Link href="/contact" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.contact')}</Link></li>
              <li><Link href="/help" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.helpSupport')}</Link></li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)' }}>
              {t('footer.stayInLoop')}
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                required
                className="px-3 py-2 text-sm rounded-sm border focus:outline-none"
                style={{ borderColor: 'var(--line)', backgroundColor: 'var(--paper)', color: 'var(--ink)' }}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
              >
                {loading ? t('footer.signingUp') : t('footer.signUp')}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--navy)' }}>
                {t('footer.legal')}
              </div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/legal/privacy" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.privacyPolicy')}</Link></li>
                <li><Link href="/legal/terms" style={{ color: 'var(--slate)' }} className="hover:text-orange-600 transition-colors">{t('footer.termsOfService')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs sm:text-sm"
          style={{ borderTop: '1px solid var(--line)', color: 'var(--slate)' }}
        >
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-6">
            <span>{t('footer.americas')} +1 (800) 555-0134</span>
            <span>{t('footer.europe')} +31 10 555 0177</span>
            <span>{t('footer.asiaPacific')} +61 7 5550 199</span>
          </div>
          <span>© {new Date().getFullYear()} {t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}