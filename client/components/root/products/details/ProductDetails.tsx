'use client';

import React from 'react';

import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';
import { useAuthStore } from '@/store/auth.store';

import ProductImages from '@/components/root/products/details/ProductImages';
import ProductInformation from '@/components/root/products/details/ProductInformation';
import NotFound from '@/components/shared/NotFound';
import BreadcrumbProducts from '@/components/root/products/BreadcrumbProducts';
import LoadingProductDetails from '@/components/shared/loading/products/LoadingProductDetails';
import Reviews from '@/components/root/products/details/reviews/Reviews';

type ProductDetailsProps = {
  productId: string;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { isAuthenticated } = useAuthStore();

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
    <div className="grid grid-cols-[1fr_2fr] gap-10">
      <div className="space-y-10">
        <BreadcrumbProducts page={data.product.name} />
        <ProductImages images={data.product.images} />
        {isAuthenticated && <Reviews productId={productId} />}
      </div>
      <div>
        <ProductInformation product={data.product} />
      </div>
    </div>
  );
};

export default ProductDetails;
