'use client';

import React, { use } from 'react';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import ProductImages from '@/components/root/products/details/ProductImages';
import ProductInformation from '@/components/root/products/details/ProductInformation';
import NotFound from '@/components/shared/NotFound';
import BreadcrumbProducts from '@/components/root/products/BreadcrumbProducts';
import LoadingProductDetails from '@/components/shared/loading/LoadingProductDetails';
import Reviews from '@/components/root/products/details/reviews/Reviews';

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ONE,
    params: { productId: productId },
  });

  if (isLoading) {
    return <LoadingProductDetails />;
  }

  if (!data) {
    return <NotFound />;
  }

  return (
    <section className="grid grid-cols-[1fr_2fr] gap-10 pt-5">
      <div className="space-y-10">
        <BreadcrumbProducts page={data.product.name} />
        <ProductImages images={data.product.images} />
        <Reviews productId={productId} />
      </div>
      <div>
        <ProductInformation product={data.product} />
      </div>
    </section>
  );
};

export default ProductDetailsPage;
