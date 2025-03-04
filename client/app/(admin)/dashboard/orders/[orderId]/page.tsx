import DashboardOrderDetails from '@/components/admin/dashboard/orders/details/DashboardOrderDetails';

const DashboardOrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  return (
    <section>
      <DashboardOrderDetails orderId={orderId} />
    </section>
  );
};

export default DashboardOrderDetailsPage;
