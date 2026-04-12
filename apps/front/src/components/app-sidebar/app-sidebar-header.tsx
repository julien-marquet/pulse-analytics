import Image from 'next/image';
import { SidebarHeader } from '../ui/sidebar';

export default function AppSideBarHeader() {
  return (
    <SidebarHeader className="flex-row items-center px-4 h-16 border-b">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
        <Image src="/logo.svg" width={32} height={32} alt="Logo" priority />
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-medium">Pulse Analytics</span>
        <span className="">v1.0.0</span>
      </div>
    </SidebarHeader>
  );
}
