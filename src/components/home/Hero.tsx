import Link from 'next/link';
import { HeroSearch } from '@/components/search/HeroSearch';

export function Hero() {
  return (
    <section
      className="relative py-24 px-6"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(14,34,51,0.55) 0%, rgba(14,34,51,0.25) 60%, rgba(14,34,51,0.15) 100%), url("/hero-excavator.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-8">
          We combine worldwide reach with hands-on help, so you sell smarter.
        </h1>

        <HeroSearch />

        <div className="flex flex-wrap gap-3">
          <Link
            href="/listings"
            className="px-6 py-3 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Browse Equipment
          </Link>
          <Link
            href="/sell"
            className="px-6 py-3 text-sm font-semibold rounded-sm border"
            style={{
              backgroundColor: 'var(--paper)',
              color: 'var(--navy)',
              borderColor: 'var(--line)',
            }}
          >
            Sell Your Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}