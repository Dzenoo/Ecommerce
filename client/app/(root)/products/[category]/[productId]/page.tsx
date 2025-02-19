'use client';

import React, { use } from 'react';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import ProductImages from '@/components/root/products/details/ProductImages';
import ProductInformation from '@/components/root/products/details/ProductInformation';
import NotFound from '@/components/shared/NotFound';

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ONE,
    productId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <NotFound />;
  }

  return (
    <section className="grid grid-cols-[1fr_2fr] gap-10 pt-5">
      <div>
        <ProductImages images={data.product.images} />
      </div>
      <div>
        <ProductInformation />
      </div>
    </section>
  );
};

export default ProductDetailsPage;
