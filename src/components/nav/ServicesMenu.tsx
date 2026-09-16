// src/components/nav/ServicesMenu.tsx

'use client';

import React from 'react';
import { MegaMenu } from './MegaMenu';
import { SidebarMegaMenu } from './SidebarMegaMenu';
import { SERVICES, SERVICE_SLUGS } from '@/lib/constants/services';

interface ServicesMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServicesMenu({ isOpen, onClose }: ServicesMenuProps) {
  const menuItems = SERVICES.map((service) => ({
    label: service,
    href: `/services/${SERVICE_SLUGS[service]}`,
  }));

  return (
    <MegaMenu isOpen={isOpen} onClose={onClose}>
      <SidebarMegaMenu
        title="All Services"
        titleHref="/services"
        items={menuItems}
        hasSubcategories={false}
      />
    </MegaMenu>
  );
}