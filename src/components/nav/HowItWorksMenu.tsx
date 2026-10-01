// src/components/nav/HowItWorksMenu.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { SidebarMegaMenu } from './SidebarMegaMenu';
import { HOW_IT_WORKS, HOW_IT_WORKS_HREFS } from '@/lib/constants/routes';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface HowItWorksMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksMenu({ isOpen, onClose }: HowItWorksMenuProps) {
  const { tk } = useLanguage();
  const menuItems = HOW_IT_WORKS.map((item) => ({
    label: tk('howItWorks', item),
    href: HOW_IT_WORKS_HREFS[item],
  }));

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <SidebarMegaMenu
        titleKey="nav.gettingStarted"
        titleHref="/how-it-works"
        items={menuItems}
        hasSubcategories={false}
      />
    </MegaMenu>
  );
}