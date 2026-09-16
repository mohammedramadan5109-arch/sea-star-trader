// src/components/nav/HowItWorksMenu.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { SidebarMegaMenu } from './SidebarMegaMenu';
import { HOW_IT_WORKS, HOW_IT_WORKS_HREFS } from '@/lib/constants/routes';

interface HowItWorksMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksMenu({ isOpen, onClose }: HowItWorksMenuProps) {
  const menuItems = HOW_IT_WORKS.map((item) => ({
    label: item,
    href: HOW_IT_WORKS_HREFS[item],
  }));

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <SidebarMegaMenu
        title="Getting Started"
        titleHref="/how-it-works"
        items={menuItems}
        hasSubcategories={false}
      />
    </MegaMenu>
  );
}