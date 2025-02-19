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

  return (
    <section className="h-full">
      <HandleProduct isEdit={true} product={data.product} />
    </section>
  );
};

export default DashboardEditProductPage;
