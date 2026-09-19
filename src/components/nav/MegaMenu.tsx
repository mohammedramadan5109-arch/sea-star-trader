'use client';

import React, { ReactNode } from 'react';

export interface MegaMenuProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

export function MegaMenu({ children, isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {onClose && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <div
        className="absolute left-0 top-full mt-2 z-50 shadow-xl rounded-lg overflow-hidden"
        style={{
          border: '1px solid #1C3040',
          backgroundColor: '#0F1E2D',
          minWidth: '700px',
        }}
      >
        {children}
      </div>
    </>
  );
}