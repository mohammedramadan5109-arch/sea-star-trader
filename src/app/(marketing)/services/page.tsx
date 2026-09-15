import Link from 'next/link';
import { SERVICES, SERVICE_SLUGS } from '@/lib/constants/services';

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold mb-4" style={{ color: 'var(--navy)' }}>
        Our Services
      </h1>
      <p className="text-lg mb-12" style={{ color: 'var(--slate)' }}>
        Full-service support for buying and selling heavy equipment worldwide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((service) => (
          <Link
            key={service}
            href={`/services/${SERVICE_SLUGS[service]}`}
            className="p-6 rounded-sm border border-[var(--line)] hover:shadow-lg transition-shadow"
            style={{ backgroundColor: 'var(--paper)' }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
              {service}
            </h3>
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              Learn more about our {service.toLowerCase()} options
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}