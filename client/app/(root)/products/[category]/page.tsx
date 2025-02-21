'use client';

import React, { use } from 'react';
import { useSearchParams } from 'next/navigation';

import { GetProductsDto } from '@/types';
import { getCategory } from '@/lib/utils';
import {
  ProductQueryType,
  useProductQuery,
} from '@/hooks/queries/useProduct.query';
import { useQueryParams } from '@/hooks/core/useQueryParams';

import NotFound from '@/components/shared/NotFound';
import ProductsList from '@/components/root/products/ProductsList';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import FilterProducts from '@/components/root/products/filters/FilterProducts';
import LoadingProducts from '@/components/shared/loading/LoadingProducts';
import BreadcrumbProducts from '@/components/root/products/BreadcrumbProducts';
import SortProducts from '@/components/root/products/filters/SortProducts';

import { Button } from '@/components/ui/buttons/button';

const ProductsPage = ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { clearAllQueryParams } = useQueryParams();
  const searchParams = useSearchParams();
  const { category } = use(params);

  const selectedCategory = getCategory('name', category);
  if (!selectedCategory) return <NotFound />;

  const query: GetProductsDto = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
    category: selectedCategory.id,
    attributes: {},
  };

  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  if (priceMin || priceMax) {
    query.price = {
      min: priceMin ? Number(priceMin) : 0,
      max: priceMax ? Number(priceMax) : 100000,
    };
  }

  selectedCategory.fields?.forEach((field) => {
    const values = searchParams.getAll(field.name);
    if (values.length > 0) {
      if (query.attributes) {
        query.attributes[field.name] = values;
      }
    }
  });

  const { data, isLoading } = useProductQuery(
    {
      type: ProductQueryType.GET_ALL,
      params: query,
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  if (isLoading) return <LoadingProducts />;

  if (!data) return <NotFound />;

  return (
    <section className="grid grid-cols-[1fr_3fr] gap-10 pt-5">
      <div className="space-y-5">
        <BreadcrumbProducts page={selectedCategory.name} />
        <FilterProducts selectedCategory={selectedCategory} />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div className="basis-full">
            <h1 className="text-xl font-bold">{selectedCategory.name}</h1>
          </div>
          <div>
            <Button variant="outline" onClick={clearAllQueryParams}>
              Clear All Filters
            </Button>
          </div>
          <div>
            <SortProducts />
          </div>
        </div>

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
