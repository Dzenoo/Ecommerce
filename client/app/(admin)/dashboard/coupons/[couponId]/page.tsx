'use client';

import { use } from 'react';

import HandleCoupon from '@/components/admin/dashboard/coupons/handle/HandleCoupon';

import {
  useCouponQuery,
  CouponQueryType,
} from '@/hooks/queries/useCoupon.query';

const DashboardEditCouponPage = ({
  params,
}: {
  params: Promise<{ couponId: string }>;
}) => {
  const { couponId } = use(params);

  const { data, isLoading } = useCouponQuery({
    type: CouponQueryType.GET_ONE,
    params: { query: {}, couponId: couponId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data) {
    return 'No coupon found';
  }

  return (
    <section className="h-full">
      <HandleCoupon isEdit={true} coupon={data.coupon} />
    </section>
  );
};

export default DashboardEditCouponPage;
