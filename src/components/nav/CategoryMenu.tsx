// src/components/nav/CategoryMenu.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { SidebarMegaMenu } from './SidebarMegaMenu';
import { useCategoryTree } from '@/queries/useCategoryTree';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface CategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryMenu({ isOpen, onClose }: CategoryMenuProps) {
  const { data: categories } = useCategoryTree();
  const { tc, tk } = useLanguage();

  const menuItems = categories?.map((cat) => ({
    label: tc(cat.name),
    href: `/listings?category=${cat.slug}`,
    count: cat.count,
    children: cat.subcategories.map((sub) => ({
      label: tk('subcategories', sub.name),
      href: `/listings?category=${cat.slug}&subcategory=${sub.slug}`,
      count: sub.count,
    })),
  })) || [];

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <SidebarMegaMenu
        titleKey="nav.allCategories"
        titleHref="/listings"
        items={menuItems}
        hasSubcategories={true}
      />
    </MegaMenu>
  );
}