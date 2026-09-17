'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Bookmark, BookmarkCheck, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ListingActionsProps {
  listingId: string;
  sellerEmail: string;
  sellerPhone?: string | null;
  emailSubject: string;
  emailBody: string;
  isLoggedIn: boolean;
  initialSaved: boolean;
}

export function ListingActions({
  listingId,
  sellerEmail,
  sellerPhone,
  emailSubject,
  emailBody,
  isLoggedIn,
  initialSaved,
}: ListingActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [contactOpen, setContactOpen] = useState(false);
  const [saved, setSaved] = useState(initialSaved);
  const [savePending, setSavePending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSaveToggle() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/listings/${listingId}`);
      return;
    }

    setSavePending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSavePending(false);
      router.push(`/login?redirect=/listings/${listingId}`);
      return;
    }

    if (saved) {
      const { error } = await supabase
        .from('saved_listings')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      if (!error) setSaved(false);
    } else {
      const { error } = await supabase
        .from('saved_listings')
        .insert({ user_id: user.id, listing_id: listingId });
      if (!error) setSaved(true);
    }
    setSavePending(false);
  }

  return (
    <div className="flex gap-4">
      {/* Contact Seller dropdown */}
      <div className="relative flex-1" ref={dropdownRef}>
        <button
          onClick={() => setContactOpen((open) => !open)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          Contact Seller
          <ChevronDown size={16} className={`transition-transform ${contactOpen ? 'rotate-180' : ''}`} />
        </button>

        {contactOpen && (
          <div
            className="absolute left-0 right-0 mt-2 rounded-sm border shadow-lg overflow-hidden z-10"
            style={{ backgroundColor: 'var(--paper)', borderColor: 'var(--line)' }}
          >
            <a
              href={`mailto:${sellerEmail}?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-black/5"
              style={{ color: 'var(--navy)' }}
              onClick={() => setContactOpen(false)}
            >
              <Mail size={18} />
              Email seller
            </a>
            {sellerPhone && (
              <a
                href={`tel:${sellerPhone}`}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-t hover:bg-black/5"
                style={{ color: 'var(--navy)', borderColor: 'var(--line)' }}
                onClick={() => setContactOpen(false)}
              >
                <Phone size={18} />
                Call seller
              </a>
            )}
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSaveToggle}
        disabled={savePending}
        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm border disabled:opacity-50"
        style={{
          borderColor: saved ? 'var(--orange)' : 'var(--line)',
          color: saved ? 'var(--orange)' : 'var(--navy)',
        }}
      >
        {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {saved ? 'Saved' : 'Save'}
      </button>
    </div>
  );
}
