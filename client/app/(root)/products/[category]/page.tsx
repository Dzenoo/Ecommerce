'use client';

import React, { use } from 'react';

import { getCategory } from '@/lib/utils';
import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import NotFound from '@/components/shared/NotFound';
import ProductsList from '@/components/root/products/ProductsList';

const ProductsPage = ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category } = use(params);
  const selectedCategory = getCategory('name', category);

  if (!selectedCategory) return <NotFound />;

  const { data, isLoading } = useProductQuery({
    type: ProductQueryType.GET_ALL,
    query: { category: selectedCategory.id },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <NotFound />;

  return (
    <section>
      <ProductsList products={data.products} />
    </section>
  );
};

export default ProductsPage;
