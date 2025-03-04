import DashboardSidebar from '@/components/admin/dashboard/sidebar/DashboardSidebar';
import AdminHeader from '@/components/admin/dashboard/sidebar/AdminHeader';

import { SidebarInset, SidebarProvider } from '@/components/ui/layout/sidebar';

const AdminLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex-1 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayoutWrapper;
