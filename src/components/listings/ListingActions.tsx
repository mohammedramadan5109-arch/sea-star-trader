'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MessageCircle, Bookmark, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@/lib/constants/contact';

interface ListingActionsProps {
  listingId: string;
  emailSubject: string;
  emailBody: string;
  whatsappMessage: string;
  isLoggedIn: boolean;
  initialSaved: boolean;
}

export function ListingActions({
  listingId,
  emailSubject,
  emailBody,
  whatsappMessage,
  isLoggedIn,
  initialSaved,
}: ListingActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [saved, setSaved] = useState(initialSaved);
  const [savePending, setSavePending] = useState(false);

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
    <div className="flex flex-wrap gap-4">
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}
        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
        style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
      >
        <Mail size={18} />
        Email us
      </a>

      <a
        href={`https://wa.me/${CONTACT_WHATSAPP}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-sm"
        style={{ backgroundColor: '#25D366', color: '#fff' }}
      >
        <MessageCircle size={18} />
        DM us
      </a>

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
