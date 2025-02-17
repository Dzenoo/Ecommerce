'use client';

import React, { use } from 'react';

import { getCategory } from '@/lib/utils';
import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';

import NotFound from '@/components/shared/NotFound';
import ProductsList from '@/components/root/products/ProductsList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

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
    <section className="grid grid-cols-[1fr_4fr] gap-10">
      <div></div>

      <div className="space-y-5">
        <ProductsList products={data.products} />

        {data.totalProducts > 10 && (
          <QueryParamController<string> paramKey="page" defaultValue="1">
            {({ value, onChange }) => (
              <PaginateList
                onPageChange={(value) => onChange(String(value))}
                totalItems={data.totalProducts}
                itemsPerPage={10}
                currentPage={Number(value)}
              />
            )}
          </QueryParamController>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
