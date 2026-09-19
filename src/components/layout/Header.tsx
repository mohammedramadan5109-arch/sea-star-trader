'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavLink } from '@/components/nav/NavLink';
import { CategoryMenu } from '@/components/nav/CategoryMenu';
import { AuctionsComingSoon } from '@/components/nav/AuctionsComingSoon';
import { ServicesMenu } from '@/components/nav/ServicesMenu';
import { HowItWorksMenu } from '@/components/nav/HowItWorksMenu';
import { SearchBar } from '@/components/search/SearchBar';

type ActiveMenu = 'category' | 'auctions' | 'services' | 'howItWorks' | null;

export function Header() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Row 1: Logo, search, auth */}
      <div
        className="flex items-center gap-6 px-6 py-3 border-b"
        style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
      >
        <Link
          href="/"
          className="text-2xl font-extrabold shrink-0"
          style={{ color: 'var(--ink)' }}
        >
          Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
        </Link>

        <SearchBar />

        <div className="flex items-center gap-4 ml-auto shrink-0">
          <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-semibold rounded-lg"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Row 2: Nav — pinned to dark navy, matching the repainted mockup.
          Previously used var(--slate), which the global theme flip turned
          into a light color, producing the pale bar. */}
      <nav style={{ backgroundColor: '#0F1E2D', borderTop: '1px solid #1C3040' }} className="relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-10">
          <div className="relative">
            <NavLink
              label="Browse by category"
              hasDropdown
              isActive={activeMenu === 'category'}
              onClick={() => toggleMenu('category')}
            />
            <CategoryMenu
              isOpen={activeMenu === 'category'}
              onClose={() => setActiveMenu(null)}
            />
          </div>

          <div className="relative">
            <NavLink
              label="Auctions"
              hasDropdown
              isActive={activeMenu === 'auctions'}
              onClick={() => toggleMenu('auctions')}
            />
            <AuctionsComingSoon
              isOpen={activeMenu === 'auctions'}
              onClose={() => setActiveMenu(null)}
            />
          </div>

          <NavLink href="/map" label="Map" />
          <NavLink href="/sell" label="Sell Equipment" />

          <div className="relative">
            <NavLink
              label="Services"
              hasDropdown
              isActive={activeMenu === 'services'}
              onClick={() => toggleMenu('services')}
            />
            <ServicesMenu
              isOpen={activeMenu === 'services'}
              onClose={() => setActiveMenu(null)}
            />
          </div>

          <NavLink href="/financing" label="Financing" />

          <div className="relative">
            <NavLink
              label="How It Works"
              hasDropdown
              isActive={activeMenu === 'howItWorks'}
              onClick={() => toggleMenu('howItWorks')}
            />
            <HowItWorksMenu
              isOpen={activeMenu === 'howItWorks'}
              onClose={() => setActiveMenu(null)}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}