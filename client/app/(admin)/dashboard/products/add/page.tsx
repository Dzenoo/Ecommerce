import HandleProduct from '@/components/admin/dashboard/products/handle/HandleProduct';

const DashboardAddProductPage = () => {
  return (
    <div className="h-full">
      <HandleProduct isEdit={false} />
    </div>
  );
};

export default DashboardAddProductPage;
