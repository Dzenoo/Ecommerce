'use client';

import { use } from 'react';

import HandleProduct from '@/components/admin/dashboard/products/handle/HandleProduct';

import {
  useProductQuery,
  ProductQueryType,
} from '@/hooks/queries/useProduct.query';

const DashboardEditProductPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ONE,
    productId: productId,
  });

  if (!data && !isLoading) {
    return 'No product found';
  }

  const productData = data || {
    product: {},
  };

  return (
    <div className="h-full">
      <HandleProduct isEdit={true} product={productData.product} />
    </div>
  );
};

export default DashboardEditProductPage;
