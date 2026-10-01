'use client';

import { Globe, Settings, Wrench, Search } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function TrustBar() {
  const { t } = useLanguage();

  const TRUST_ITEMS = [
    {
      icon: Globe,
      titleKey: 'trust.globalReach' as const,
      bodyKey: 'trust.globalReachBody' as const,
    },
    {
      icon: Settings,
      titleKey: 'trust.flexible' as const,
      bodyKey: 'trust.flexibleBody' as const,
    },
    {
      icon: Wrench,
      titleKey: 'trust.fullService' as const,
      bodyKey: 'trust.fullServiceBody' as const,
    },
    {
      icon: Search,
      titleKey: 'trust.transparent' as const,
      bodyKey: 'trust.transparentBody' as const,
    },
  ];
  return (
    <section style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: Icon, titleKey, bodyKey }, i) => (
          <div
            key={titleKey}
            className={`card-tilt px-6 sm:px-8 py-6 sm:py-8 border-[var(--line)] ${
              i === 0 ? '' : 'border-t sm:border-t lg:border-t-0 lg:border-l'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={20} style={{ color: 'var(--orange)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                {t(titleKey)}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              {t(bodyKey)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}