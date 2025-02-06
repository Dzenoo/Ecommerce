import React from 'react';

import Overview from '@/components/admin/dashboard/Overview';
import SalesPerformance from '@/components/admin/dashboard/SalesPerformance';
import OrdersByStatus from '@/components/admin/dashboard/OrdersByStatus';
import TopSellingProducts from '@/components/admin/dashboard/TopSellingProducts';
import CustomerGrowth from '@/components/admin/dashboard/CustomerGrowth';

const DashboardPage = () => {
  return (
    <section className="grid grid-cols-1 gap-5">
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
      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        <SalesPerformance />
        <OrdersByStatus />
        <TopSellingProducts />
        <CustomerGrowth />
      </div>
    </section>
  );
};

export default DashboardPage;
