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

  const analyticsData = data?.data || {
    overview: {
      totalOrders: 0,
      ordersThisMonth: 0,
      totalProducts: 0,
      productsThisMonth: 0,
      totalUsers: 0,
      usersThisMonth: 0,
      totalRevenue: 0,
      revenueThisMonth: 0,
    },
    salesPerformance: [],
    ordersByStatus: [],
    topSellingProducts: [],
    customerGrowth: [],
  };

  return (
    <section className="grid grid-cols-1 gap-5">
      <div>
        <Overview
          totalOrders={analyticsData.overview.totalOrders}
          totalProducts={analyticsData.overview.totalProducts}
          totalRevenue={analyticsData.overview.totalRevenue}
          totalUsers={analyticsData.overview.totalUsers}
          ordersThisMonth={analyticsData.overview.ordersThisMonth}
          productsThisMonth={analyticsData.overview.productsThisMonth}
          revenueThisMonth={analyticsData.overview.revenueThisMonth}
          usersThisMonth={analyticsData.overview.usersThisMonth}
        />
      </div>
      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        <SalesPerformance data={analyticsData.salesPerformance} />
        <OrdersByStatus data={analyticsData.ordersByStatus} />
        <TopSellingProducts data={analyticsData.topSellingProducts} />
        <CustomerGrowth data={analyticsData.customerGrowth} />
      </div>
    </section>
  );
};

export default DashboardPage;
