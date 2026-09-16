// src/components/nav/MegaMenu.tsx

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
      {/* Backdrop */}
      {onClose && (
        <div 
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Dropdown Menu */}
      <div 
        className="absolute left-0 top-full mt-2 z-50 bg-white shadow-xl"
        style={{ 
          border: '1px solid var(--line)',
          minWidth: '700px'
        }}
      >
        {children}
      </div>
    </>
  );
}