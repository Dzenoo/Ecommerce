'use client';

import React from 'react';

import {
  useCouponQuery,
  CouponQueryType,
} from '@/hooks/queries/useCoupon.query';

import DashboardCouponsList from '@/components/admin/dashboard/coupons/DashboardCouponsList';

const DashboardCouponsPage = () => {
  const { data, isLoading } = useCouponQuery({
    type: CouponQueryType.GET_ALL,
    query: {},
  });

  if (!data && !isLoading) {
    return 'No coupons found';
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
