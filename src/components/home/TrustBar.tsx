import { Globe, Settings, Wrench, Search } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Globe,
    title: 'Global reach',
    body: "Tap into the world's largest network of serious equipment buyers.",
  },
  {
    icon: Settings,
    title: 'Flexible',
    body: 'Auctions, fixed price, or private sale — choose what works for you.',
  },
  {
    icon: Wrench,
    title: 'Full-service',
    body: 'From inspection to payment, we handle every step.',
  },
  {
    icon: Search,
    title: 'Transparent',
    body: 'No hidden fees — know exactly how and when your equipment sells.',
  },
];

export function TrustBar() {
  return (
    <section style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className="px-8 py-8"
            style={{ borderLeft: i === 0 ? 'none' : '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={20} style={{ color: 'var(--orange)' }} />
              <span className="font-bold text-sm" style={{ color: 'var(--navy)' }}>
                {title}
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}