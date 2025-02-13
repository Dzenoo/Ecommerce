import HandleProduct from '@/components/admin/dashboard/products/handle/HandleProduct';

const DashboardAddProductPage = () => {
  return (
    <section className="h-full">
      <HandleProduct isEdit={false} />
    </section>
  );
};

export default DashboardAddProductPage;
