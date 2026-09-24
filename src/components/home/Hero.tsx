import Link from 'next/link';
import { HeroSearch } from '@/components/search/HeroSearch';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div
        className="absolute inset-0 hero-kenburns"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(14,34,51,0.55) 0%, rgba(14,34,51,0.25) 60%, rgba(14,34,51,0.15) 100%), url("/hero-excavator.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <h1
          className="animate-fade-in-up text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-5 md:mb-8"
          style={{ animationDelay: '0.05s' }}
        >
          We combine worldwide reach with hands-on help, so you sell smarter.
        </h1>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <HeroSearch />
        </div>

        <div
          className="animate-fade-in-up flex flex-col sm:flex-row flex-wrap gap-4"
          style={{ animationDelay: '0.35s' }}
        >
          <Link
            href="/listings"
            className="btn-3d px-6 py-3 text-sm font-semibold rounded-lg text-center"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Browse Equipment
          </Link>
          <Link
            href="/sell"
            className="btn-3d px-6 py-3 text-sm font-semibold rounded-lg text-center"
            style={{
              backgroundColor: 'var(--paper)',
              color: 'var(--navy)',
            }}
          >
            Sell Your Equipment
          </Link>
        </div>
      </div>
    </section>
  );
}