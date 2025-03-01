'use client';

import HandleProduct from '@/components/admin/dashboard/products/handle/HandleProduct';

import {
  useProductQuery,
  ProductQueryType,
} from '@/hooks/queries/useProduct.query';

type DashboardEditProductProps = {
  productId: string;
};

const DashboardEditProduct: React.FC<DashboardEditProductProps> = ({
  productId,
}) => {
  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ONE,
    params: { productId: productId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data) {
    return 'No product found';
  }

  return <HandleProduct isEdit={true} product={data?.product} />;
};

export default DashboardEditProduct;
