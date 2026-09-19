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

// Palette matched exactly to the repainted mockup
const BG_DARK = '#0A1520';
const BG_SURFACE = '#0F1E2D';
const BORDER = '#1C3040';
const TEXT = '#E8EDF2';
const TEXT_MUTED = '#8FA3B5';
const ACCENT = '#F5B324';

export function SidebarMegaMenu({
  title,
  titleHref,
  items,
  hasSubcategories = false,
}: SidebarMegaMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex">
      {/* Left column */}
      <div className="w-64" style={{ backgroundColor: BG_DARK }}>
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <Link
            href={titleHref}
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color: TEXT }}
          >
            {title}
          </Link>
        </div>

        <nav>
          {items.map((item) => {
            const isHovered = hoveredItem === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-3 text-sm transition-colors border-l-2"
                style={{
                  color: isHovered ? ACCENT : TEXT,
                  backgroundColor: isHovered ? BG_SURFACE : 'transparent',
                  borderLeftColor: isHovered ? ACCENT : 'transparent',
                }}
                onMouseEnter={() => setHoveredItem(item.label)}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="text-xs" style={{ color: TEXT_MUTED }}>
                      ({item.count})
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right column */}
      <div className="p-6" style={{ backgroundColor: BG_SURFACE, minWidth: '450px' }}>
        {hasSubcategories ? (
          hoveredItem ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {items
                .find((item) => item.label === hoveredItem)
                ?.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-3 py-2 text-sm rounded-md transition-colors"
                    style={{ color: TEXT }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = BG_DARK;
                      e.currentTarget.style.color = ACCENT;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = TEXT;
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{child.label}</span>
                      {child.count !== undefined && (
                        <span className="text-xs flex-shrink-0" style={{ color: TEXT_MUTED }}>
                          ({child.count})
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm" style={{ color: TEXT_MUTED }}>
              Hover over a category
            </div>
          )
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-sm rounded-md transition-colors"
                style={{ color: TEXT }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BG_DARK;
                  e.currentTarget.style.color = ACCENT;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = TEXT;
                }}
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