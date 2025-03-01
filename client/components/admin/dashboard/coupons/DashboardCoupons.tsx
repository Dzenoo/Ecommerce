'use client';

import React from 'react';

import {
  useCouponQuery,
  CouponQueryType,
} from '@/hooks/queries/useCoupon.query';

import DashboardCouponsList from '@/components/admin/dashboard/coupons/DashboardCouponsList';
import LoadingDashboardCoupons from '@/components/shared/loading/dashboard/LoadingDashboardCoupons';
import NotFound from '@/components/shared/NotFound';

const DashboardCoupons: React.FC = () => {
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
    <div className="flex flex-col gap-5">
      <DashboardCouponsList
        couponsData={{ coupons: data.coupons, totalCoupons: data.totalCoupons }}
      />
    </div>
  );
};

export default DashboardCoupons;
