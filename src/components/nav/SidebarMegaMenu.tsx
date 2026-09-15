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
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="flex">
      {/* Left sidebar */}
      <div className="w-64 shrink-0 bg-[var(--navy)]">
        {items.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-4 py-3 text-sm border-l-4 border-transparent hover:bg-[#1D3E5C] text-white"
            style={{
              backgroundColor: selectedItem === item.label ? '#1D3E5C' : 'transparent',
            }}
            onMouseEnter={() => hasSubcategories && setSelectedItem(item.label)}
          >
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="text-xs text-gray-400">{item.count}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Right panel - only show for items with children */}
      {hasSubcategories && (
        <div 
          className="w-[420px] p-4 grid grid-cols-2 gap-1 content-start max-h-[500px] overflow-y-auto bg-[var(--off-white)]"
        >
          {selectedItem ? (
            items
              .find((item) => item.label === selectedItem)
              ?.children?.map((child) => (
                <Link
                  key={child.label}
                  href={child.href}
                  className="block px-3 py-3 text-sm font-medium rounded-sm hover:bg-[#E8E7E3] text-[var(--navy)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex-1">{child.label}</span>
                    {child.count !== undefined && (
                      <span className="text-xs shrink-0 text-gray-500">{child.count}</span>
                    )}
                  </div>
                </Link>
              ))
          ) : (
            <div className="col-span-2 text-center py-12 text-sm text-[var(--slate)]">
              Hover over a category to see subcategories
            </div>
          )}
        </div>
      )}

      {/* Simple panel for services/how-it-works (no subcategories) */}
      {!hasSubcategories && (
        <div className="w-64 p-4 bg-[var(--off-white)]">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-3 py-3 text-sm font-medium rounded-sm hover:bg-[#E8E7E3] text-[var(--navy)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}