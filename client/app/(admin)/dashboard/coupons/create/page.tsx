import HandleCoupon from '@/components/admin/dashboard/coupons/handle/HandleCoupon';

const DashboardCreateCouponPage = () => {
  return (
    <section className="h-full">
      <HandleCoupon isEdit={false} />
    </section>
  );
};

export default DashboardCreateCouponPage;
