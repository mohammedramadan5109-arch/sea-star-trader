import Link from 'next/link';
import { HeroSearch } from '@/components/search/HeroSearch';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      {/* Animated background layer — separate from the content below so the
          zoom doesn't scale the text/buttons along with the image. */}
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
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-5 md:mb-8">
          We combine worldwide reach with hands-on help, so you sell smarter.
        </h1>

        <HeroSearch />

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Link
            href="/listings"
            className="px-6 py-3 text-sm font-semibold rounded-lg text-center transition-transform duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Browse Equipment
          </Link>
          <Link
            href="/sell"
            className="px-6 py-3 text-sm font-semibold rounded-lg border text-center transition-transform duration-150 active:scale-[0.97]"
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