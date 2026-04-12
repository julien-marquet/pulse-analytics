import { Separator } from '@base-ui/react';
import { SidebarTrigger } from '../ui/sidebar';
import AppBreadcrumb from './app-breadcrumb';

export default function AppTopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4 w-px bg-border"
      />
      <AppBreadcrumb />
    </header>
  );
}
