import DashboardEditProduct from '@/components/admin/dashboard/products/DashboardEditProduct';

const DashboardEditProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  return (
    <section className="h-full">
      <DashboardEditProduct productId={productId} />
    </section>
  );
};

export default DashboardEditProductPage;
