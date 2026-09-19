'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface NavLinkProps {
  href?: string;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function NavLink({ href, label, hasDropdown, isActive, onClick }: NavLinkProps) {
  const baseStyles = 'flex items-center gap-1 text-base font-semibold focus:outline-none transition-colors';
  // Was text-[var(--paper)] — after the global theme flip that resolves to
  // dark navy, which is invisible against the now-dark nav bar. Pinned to
  // white so it stays readable regardless of how --paper is themed elsewhere.
  const colorStyles = isActive ? 'text-[var(--orange)]' : 'text-white';

  const content = (
    <>
      {label}
      {hasDropdown && <ChevronDown size={16} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${colorStyles}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${colorStyles}`}>
      {content}
    </button>
  );
}