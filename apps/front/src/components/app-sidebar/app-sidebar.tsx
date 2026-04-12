import {
  SidebarContent,
  SidebarFooter,
  Sidebar,
  SidebarGroup,
} from '../ui/sidebar';
import AppSideBarHeader from './app-sidebar-header';
import AppSidebarNavigationMenu from './app-sidebar-navigation-menu';

export default function AppSidebar() {
  return (
    <Sidebar>
      <AppSideBarHeader />
      <SidebarContent>
        <SidebarGroup>
          <AppSidebarNavigationMenu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
