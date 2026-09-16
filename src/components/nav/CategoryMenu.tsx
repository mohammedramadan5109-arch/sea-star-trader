// src/components/nav/CategoryMenu.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { SidebarMegaMenu } from './SidebarMegaMenu';
import { useCategoryTree } from '@/queries/useCategoryTree';

interface CategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryMenu({ isOpen, onClose }: CategoryMenuProps) {
  const { data: categories } = useCategoryTree();

  const menuItems = categories?.map((cat) => ({
    label: cat.name,
    href: `/listings?category=${cat.slug}`,
    count: cat.count,
    children: cat.subcategories.map((sub) => ({
      label: sub.name,
      href: `/listings?category=${cat.slug}&subcategory=${sub.slug}`,
      count: sub.count,
    })),
  })) || [];

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <SidebarMegaMenu
        title="All Categories"
        titleHref="/listings"
        items={menuItems}
        hasSubcategories={true}
      />
    </MegaMenu>
  );
}