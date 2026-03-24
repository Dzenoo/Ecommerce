'use client';

import DashboardSidebar from '@/components/admin/dashboard/sidebar/DashboardSidebar';
import AdminHeader from '@/components/admin/dashboard/sidebar/AdminHeader';
import { AdminGuard } from '@/components/admin/AdminGuard';

import { SidebarInset, SidebarProvider } from '@shared/components/ui/layout/sidebar';

const AdminLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <AdminGuard>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="flex-1 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
};

export default AdminLayoutWrapper;
