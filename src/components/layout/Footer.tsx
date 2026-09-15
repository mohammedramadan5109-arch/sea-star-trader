'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Wire to your email provider API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--off-white)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="text-xl font-extrabold mb-3" style={{ color: 'var(--ink)' }}>
              Sea<span style={{ color: 'var(--orange)' }}>Star</span>Trader
            </div>
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              Worldwide reach, hands-on help — the transparent way to buy and sell heavy equipment.
            </p>
          </div>

          <div>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--navy)' }}
            >
              Marketplace
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings" style={{ color: 'var(--slate)' }}>
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/sell" style={{ color: 'var(--slate)' }}>
                  Sell Equipment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--navy)' }}
            >
              Company
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" style={{ color: 'var(--slate)' }}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/financing" style={{ color: 'var(--slate)' }}>
                  Financing
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ color: 'var(--slate)' }}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: 'var(--slate)' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--navy)' }}
            >
              Legal
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/privacy" style={{ color: 'var(--slate)' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" style={{ color: 'var(--slate)' }}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div
              className="text-xs font-bold uppercase tracking-wide mb-3"
              style={{ color: 'var(--navy)' }}
            >
              Stay in the Loop
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="px-3 py-2 text-sm rounded-sm border focus:outline-none"
                style={{
                  borderColor: 'var(--line)',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold rounded-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>

        <div
          className="pt-6 flex flex-wrap items-center justify-between gap-4 text-sm"
          style={{ borderTop: '1px solid var(--line)', color: 'var(--slate)' }}
        >
          <div className="flex flex-wrap gap-6">
            <span>Americas: +1 (800) 555-0134</span>
            <span>Europe: +31 10 555 0177</span>
            <span>Asia-Pacific: +61 7 5550 199</span>
          </div>
          <span>© 2026 SeaStarTrader. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}