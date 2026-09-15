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
  if (!isOpen) return null;

  const menuItems = SERVICES.map((service) => ({
    label: service,
    href: `/services/${SERVICE_SLUGS[service]}`,
  }));

  return (
    <MegaMenu isOpen={isOpen} width="medium">
      <SidebarMegaMenu
        title="All services"
        titleHref="/services"
        items={menuItems}
        hasSubcategories={false}
      />
    </MegaMenu>
  );
}