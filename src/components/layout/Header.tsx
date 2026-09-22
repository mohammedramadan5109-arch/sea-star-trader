'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import { NavLink } from '@/components/nav/NavLink';
import { CategoryMenu } from '@/components/nav/CategoryMenu';
import { AuctionsComingSoon } from '@/components/nav/AuctionsComingSoon';
import { ServicesMenu } from '@/components/nav/ServicesMenu';
import { HowItWorksMenu } from '@/components/nav/HowItWorksMenu';
import { SearchBar } from '@/components/search/SearchBar';

type ActiveMenu = 'category' | 'auctions' | 'services' | 'howItWorks' | null;

const MOBILE_LINKS = [
  { label: 'Browse equipment', href: '/listings' },
  { label: 'Auctions', href: '/auctions' },
  { label: 'Map', href: '/map' },
  { label: 'Sell equipment', href: '/sell' },
  { label: 'Services', href: '/services' },
  { label: 'Financing', href: '/financing' },
  { label: 'How it works', href: '/how-it-works' },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Row 1: Logo, search, auth */}
      <div
        className="flex items-center gap-3 md:gap-6 px-4 md:px-6 py-3 border-b"
        style={{ backgroundColor: 'var(--off-white)', borderColor: 'var(--line)' }}
      >
        <button
          className="md:hidden shrink-0 transition-transform duration-150 active:scale-90"
          style={{ color: 'var(--ink)' }}
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link
          href="/"
          className="text-lg md:text-2xl font-extrabold shrink-0"
          style={{ color: 'var(--ink)' }}
        >
          Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
        </Link>

        <div className="hidden md:block flex-1">
          <SearchBar />
        </div>

        <button
          className="md:hidden ml-auto transition-transform duration-150 active:scale-90"
          style={{ color: 'var(--ink)' }}
          onClick={() => setMobileSearchOpen((v) => !v)}
          aria-label="Search"
        >
          <Search size={22} />
        </button>

        <div className="hidden md:flex items-center gap-4 ml-auto shrink-0">
          <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-transform duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Create Account
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Link
            href="/register"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-transform duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Mobile search row — fades/slides open instead of popping in */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: mobileSearchOpen ? '120px' : '0px',
          backgroundColor: 'var(--off-white)',
          borderBottom: mobileSearchOpen ? '1px solid var(--line)' : 'none',
        }}
      >
        <div className="px-4 py-3">
          <SearchBar />
        </div>
      </div>

      {/* Row 2: Nav — desktop only */}
      <nav
        style={{ backgroundColor: '#0F1E2D', borderTop: '1px solid #1C3040' }}
        className="relative hidden md:block"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-10">
          <div className="relative">
            <NavLink
              label="Browse by category"
              hasDropdown
              isActive={activeMenu === 'category'}
              onClick={() => toggleMenu('category')}
            />
            <CategoryMenu isOpen={activeMenu === 'category'} onClose={() => setActiveMenu(null)} />
          </div>

          <div className="relative">
            <NavLink
              label="Auctions"
              hasDropdown
              isActive={activeMenu === 'auctions'}
              onClick={() => toggleMenu('auctions')}
            />
            <AuctionsComingSoon isOpen={activeMenu === 'auctions'} onClose={() => setActiveMenu(null)} />
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
            <ServicesMenu isOpen={activeMenu === 'services'} onClose={() => setActiveMenu(null)} />
          </div>

          <NavLink href="/financing" label="Financing" />

          <div className="relative">
            <NavLink
              label="How It Works"
              hasDropdown
              isActive={activeMenu === 'howItWorks'}
              onClick={() => toggleMenu('howItWorks')}
            />
            <HowItWorksMenu isOpen={activeMenu === 'howItWorks'} onClose={() => setActiveMenu(null)} />
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer — always mounted, animated via transform/opacity
          so it slides in/out instead of snapping. pointer-events toggled
          so the closed, off-screen drawer doesn't block clicks. */}
      <div
        className="md:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-out"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className="absolute top-0 left-0 h-full w-72 max-w-[80vw] p-4 overflow-y-auto transition-transform duration-300 ease-out"
          style={{
            backgroundColor: '#0F1E2D',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-bold" style={{ color: '#FFFFFF' }}>
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{ color: '#FFFFFF' }}
              className="transition-transform duration-150 active:scale-90"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="space-y-1">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 text-sm font-medium rounded-md transition-colors active:bg-white/10"
                style={{ color: '#FFFFFF' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 pt-6 border-t space-y-2" style={{ borderColor: '#1C3040' }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-semibold rounded-md text-center border transition-transform duration-150 active:scale-[0.97]"
              style={{ color: '#FFFFFF', borderColor: '#1C3040' }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-3 text-sm font-semibold rounded-md text-center transition-transform duration-150 active:scale-[0.97]"
              style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}