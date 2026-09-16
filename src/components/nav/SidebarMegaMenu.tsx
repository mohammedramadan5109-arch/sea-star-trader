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
}

export function SidebarMegaMenu({ 
  title, 
  titleHref, 
  items, 
  hasSubcategories = false 
}: SidebarMegaMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex">
      {/* Left Column - Navy */}
      <div className="w-64" style={{ backgroundColor: 'var(--navy)' }}>
        {/* Title */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <Link 
            href={titleHref}
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: 'var(--paper)' }}
          >
            {title}
          </Link>
        </div>
        
        {/* Menu Items */}
        <nav>
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm transition-colors"
              style={{
                color: 'var(--paper)',
                backgroundColor: hoveredItem === item.label ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              onMouseEnter={() => setHoveredItem(item.label)}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-xs opacity-60">({item.count})</span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Right Column - White */}
      <div className="w-80 p-6" style={{ backgroundColor: 'var(--off-white)' }}>
        {hasSubcategories ? (
          // Show subcategories on hover
          hoveredItem ? (
            <div className="space-y-1">
              {items
                .find((item) => item.label === hoveredItem)
                ?.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-3 py-2 text-sm rounded hover:bg-white transition-colors"
                    style={{ color: 'var(--navy)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{child.label}</span>
                      {child.count !== undefined && (
                        <span className="text-xs" style={{ color: 'var(--slate)' }}>
                          ({child.count})
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              }
            </div>
          ) : (
            <div className="py-12 text-center text-sm" style={{ color: 'var(--slate)' }}>
              Hover over a category
            </div>
          )
        ) : (
          // Simple list for services/how-it-works
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-sm rounded hover:bg-white transition-colors"
                style={{ color: 'var(--navy)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}