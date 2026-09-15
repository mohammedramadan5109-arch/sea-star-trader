// src/components/nav/SidebarMegaMenu.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface MenuItem {
  label: string;
  href: string;
  count?: number;
  children?: MenuItem[];
}

interface SidebarMegaMenuProps {
  title: string;
  titleHref: string;
  items: MenuItem[];
  hasSubcategories?: boolean;
  isOpen: boolean;
  width?: 'small' | 'medium' | 'large' | 'full' | 'wide';
}

export function SidebarMegaMenu({ 
  title, 
  titleHref, 
  items, 
  hasSubcategories = false,
  isOpen,
  width = 'wide'
}: SidebarMegaMenuProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="flex min-w-[680px]">
      {/* Left sidebar - Navy Background */}
      <div className="w-64 shrink-0" style={{ backgroundColor: 'var(--navy)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link 
            href={titleHref}
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: 'var(--paper)' }}
          >
            {title}
          </Link>
        </div>
        
        <nav>
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm transition-colors"
              style={{
                color: 'var(--paper)',
                backgroundColor: selectedItem === item.label ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              onMouseEnter={() => hasSubcategories && setSelectedItem(item.label)}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-xs" style={{ color: 'var(--steel-light)' }}>
                    ({item.count})
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Right panel - White Background */}
      {hasSubcategories && (
        <div 
          className="flex-1 p-6 max-h-[500px] overflow-y-auto"
          style={{ backgroundColor: 'var(--paper)' }}
        >
          {selectedItem ? (
            <div className="grid grid-cols-2 gap-4">
              {items
                .find((item) => item.label === selectedItem)
                ?.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-3 py-2 text-sm rounded-sm transition-colors hover:bg-gray-50"
                    style={{ color: 'var(--navy)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex-1">{child.label}</span>
                      {child.count !== undefined && (
                        <span className="text-xs shrink-0" style={{ color: 'var(--slate)' }}>
                          ({child.count})
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--slate)' }}>
              Hover over a category to see subcategories
            </div>
          )}
        </div>
      )}

      {/* Simple panel for services/how-it-works (no subcategories) */}
      {!hasSubcategories && (
        <div 
          className="flex-1 p-6"
          style={{ backgroundColor: 'var(--paper)' }}
        >
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-sm font-medium rounded-sm hover:bg-gray-50"
                style={{ color: 'var(--navy)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}