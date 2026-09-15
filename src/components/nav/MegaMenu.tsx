'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface MegaMenuProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void; // ✅ Add this
  width?: 'small' | 'medium' | 'large' | 'full' | 'wide';
}

export function MegaMenu({ 
  children, 
  isOpen, 
  onClose, // ✅ Add this
  width = 'medium' 
}: MegaMenuProps) {
  const widthStyles = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-7xl',
    wide: 'max-w-6xl',
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - only render if onClose exists */}
      {onClose && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu Content */}
      <div className={cn(
        'absolute left-0 right-0 top-full mt-2 z-50',
        'bg-white rounded-sm shadow-xl border border-gray-200',
        widthStyles[width],
        'mx-auto'
      )}>
        {children}
      </div>
    </>
  );
}