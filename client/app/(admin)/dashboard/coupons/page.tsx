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
    params: { query: {} },
  });

  if (isLoading) {
    return <LoadingDashboardCoupons />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  return (
    <section className="flex flex-col gap-5">
      <DashboardCouponsList
        couponsData={{ coupons: data.coupons, totalCoupons: data.totalCoupons }}
      />
    </section>
  );
};

export default DashboardCouponsPage;
