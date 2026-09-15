'use client';

import React from 'react';

interface MegaMenuProps {
  isOpen: boolean;
  children: React.ReactNode;
  width?: 'narrow' | 'medium' | 'wide';
}

export function MegaMenu({ isOpen, children, width = 'medium' }: MegaMenuProps) {
  if (!isOpen) return null;

  const widths = {
    narrow: 'w-64',
    medium: 'w-[520px]',
    wide: 'w-[684px]',
  };

  return (
    <div
      className={`absolute left-0 top-full shadow-lg z-50 ${widths[width]}`}
      style={{ border: '1px solid var(--line)' }}
    >
      {children}
    </div>
  );
}