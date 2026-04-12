'use client';

import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';

export default function AppSidebarNavigationMenu() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<a href="/overview">Overview</a>}
          isActive={pathname === '/overview'}
        />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<a href="/events">Events</a>}
          isActive={pathname === '/events'}
        />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<a href="/stats">Stats</a>}
          isActive={pathname === '/stats'}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
