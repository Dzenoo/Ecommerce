import React from 'react';

import Overview from '@/components/admin/dashboard/Overview';

const DashboardPage = () => {
  return (
    <section>
      <div>
        <Overview
          totalOrders={0}
          totalProducts={0}
          totalRevenue={0}
          totalUsers={0}
          ordersThisMonth={0}
          productsThisMonth={0}
          revenueThisMonth={0}
          usersThisMonth={0}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
