// src/components/nav/AuctionsComingSoon.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface AuctionsComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuctionsComingSoon({ isOpen, onClose }: AuctionsComingSoonProps) {
  const { t } = useLanguage();
  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <div className="p-8 text-center" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            {t('nav.auctionsComingSoon')}
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate)' }}>
            {t('nav.auctionsComingSoonBody')}
          </p>
          <button 
            className="mt-6 px-6 py-2 text-sm font-semibold rounded-sm"
            style={{ backgroundColor: 'var(--orange)', color: 'var(--paper)' }}
          >
            {t('nav.getNotified')}
          </button>
        </div>
      </div>
    </MegaMenu>
  );
}