'use client';

import { MegaMenu } from './MegaMenu';

interface AuctionsComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuctionsComingSoon({ isOpen, onClose }: AuctionsComingSoonProps) {
  if (!isOpen) return null;

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose} width="medium">
      <div className="w-full p-8 text-center bg-[var(--off-white)]">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
        >
          COMING SOON
        </div>
        <h3 className="text-lg font-bold mb-2 text-[var(--navy)]">
          Live auctions launching soon
        </h3>
        <p className="text-sm max-w-md mx-auto text-[var(--slate)]">
          We're building unreserved and timed auction features. Join our mailing list to be
          notified when bidding goes live.
        </p>
      </div>
    </MegaMenu>
  );
}