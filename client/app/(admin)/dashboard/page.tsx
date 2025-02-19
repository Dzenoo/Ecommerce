'use client';

import React from 'react';

import {
  AnalyticsQueryType,
  useAnalyticsQuery,
} from '@/hooks/queries/useAnalytics.query';

import Overview from '@/components/admin/dashboard/Overview';
import SalesPerformance from '@/components/admin/dashboard/SalesPerformance';
import OrdersByStatus from '@/components/admin/dashboard/OrdersByStatus';
import TopSellingProducts from '@/components/admin/dashboard/TopSellingProducts';
import CustomerGrowth from '@/components/admin/dashboard/CustomerGrowth';
import LoadingDashboard from '@/components/shared/loading/LoadingDashboard';
import NotFound from '@/components/shared/NotFound';

const DashboardPage = () => {
  const { data, isLoading } = useAnalyticsQuery({
    type: AnalyticsQueryType.GET_ANALYTICS,
  });

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (!data && !isLoading) {
    return <NotFound href="/dashboard" />;
  }

  return (
    <section className="grid grid-cols-1 gap-5">
      <div>
        <Overview
          totalOrders={data.data.overview.totalOrders}
          totalProducts={data.data.overview.totalProducts}
          totalRevenue={data.data.overview.totalRevenue}
          totalUsers={data.data.overview.totalUsers}
          ordersThisMonth={data.data.overview.ordersThisMonth}
          productsThisMonth={data.data.overview.productsThisMonth}
          revenueThisMonth={data.data.overview.revenueThisMonth}
          usersThisMonth={data.data.overview.usersThisMonth}
        />
      </div>
      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        <SalesPerformance data={data.data.salesPerformance} />
        <OrdersByStatus data={data.data.ordersByStatus} />
        <TopSellingProducts data={data.data.topSellingProducts} />
        <CustomerGrowth data={data.data.customerGrowth} />
      </div>
    </section>
  );
};

export default DashboardPage;
