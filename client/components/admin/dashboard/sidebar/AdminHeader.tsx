import React from 'react';
import { Calendar } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/layout/sidebar';
import { Separator } from '@/components/ui/layout/separator';

const AdminHeader: React.FC = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Dashboard Overview</h1>
      </div>
      <div className="px-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </header>
  );
};

export default AdminHeader;
