'use client';

import React from 'react';

import Branding from './Branding';
import SidebarNav from './SidebarNav';
import UserInfo from './UserInfo';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/layout/sidebar';

const DashboardSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarHeader className="pt-5">
        <Branding />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter className="pb-5">
        <UserInfo />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
