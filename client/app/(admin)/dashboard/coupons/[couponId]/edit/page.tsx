import DashboardEditCoupon from '@/components/admin/dashboard/coupons/DashboardEditCoupon';

const DashboardEditCouponPage = async ({
  params,
}: {
  params: Promise<{ couponId: string }>;
}) => {
  const { couponId } = await params;

  return (
    <section className="h-full">
      <DashboardEditCoupon couponId={couponId} />
    </section>
  );
};

export default DashboardEditCouponPage;
