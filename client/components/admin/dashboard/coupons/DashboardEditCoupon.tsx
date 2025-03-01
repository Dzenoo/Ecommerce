'use client';

import HandleCoupon from '@/components/admin/dashboard/coupons/handle/HandleCoupon';

import {
  CouponQueryType,
  useCouponQuery,
} from '@/hooks/queries/useCoupon.query';

type DashboardEditCouponProps = {
  couponId: string;
};

const DashboardEditCoupon: React.FC<DashboardEditCouponProps> = ({
  couponId,
}) => {
  const { data, isLoading } = useCouponQuery({
    type: CouponQueryType.GET_ONE,
    params: { couponId: couponId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data) {
    return 'No coupon found';
  }

  return <HandleCoupon isEdit={true} coupon={data.coupon} />;
};

export default DashboardEditCoupon;
