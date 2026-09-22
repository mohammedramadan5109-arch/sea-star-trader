'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function SaveButton({
  listingId,
  isLoggedIn,
  initialSaved,
}: {
  listingId: string;
  isLoggedIn: boolean;
  initialSaved: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/listings/${listingId}`);
      return;
    }
    setPending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setPending(false);
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
    setPending(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border shrink-0 disabled:opacity-50 transition-transform duration-150 active:scale-95"
      style={{
        borderColor: saved ? 'var(--lst-accent)' : 'var(--lst-border)',
        color: saved ? 'var(--lst-accent)' : 'var(--lst-text-muted)',
      }}
    >
      <Heart size={14} fill={saved ? 'var(--lst-accent)' : 'none'} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}