'use client';

import React from 'react';

import {
  useCouponQuery,
  CouponQueryType,
} from '@/hooks/queries/useCoupon.query';

import DashboardCouponsList from '@/components/admin/dashboard/coupons/DashboardCouponsList';
import LoadingDashboardCoupons from '@/components/shared/loading/LoadingDashboardCoupons';
import NotFound from '@/components/shared/NotFound';

const DashboardCouponsPage = () => {
  const { data, isLoading } = useCouponQuery({
    type: CouponQueryType.GET_ALL,
    query: {},
  });

  if (isLoading) {
    return <LoadingDashboardCoupons />;
  }

  if (!data && !isLoading) {
    return <NotFound href="/dashboard" />;
  }

  const couponsData = data || {
    coupons: [],
    totalCoupons: 0,
  };

  return (
    <section className="flex flex-col gap-5">
      <DashboardCouponsList couponsData={couponsData} />
    </section>
  );
};

export default DashboardCouponsPage;
