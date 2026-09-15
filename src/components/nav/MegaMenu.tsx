// src/components/nav/MegaMenu.tsx

'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface MegaMenuProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  width?: 'small' | 'medium' | 'large' | 'full' | 'wide';
}

export function MegaMenu({ 
  children, 
  isOpen, 
  onClose,
  width = 'medium' 
}: MegaMenuProps) {
  const widthStyles = {
    small: 'max-w-md',
    medium: 'max-w-3xl',
    large: 'max-w-5xl',
    wide: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {onClose && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu Content */}
      <div 
        className={cn(
          'absolute top-full mt-2 z-50',
          'bg-white shadow-xl',
          widthStyles[width],
        )}
        style={{ 
          border: '1px solid var(--line)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {children}
      </div>
    </>
  );
}